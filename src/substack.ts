// Thin client for Substack's internal web API (unofficial: the same endpoints substack.com's own UI calls).
// Public reads need no auth; draft endpoints need the author's substack.sid session cookie.

export interface Env {
  SUBSTACK_PUBLICATION: string;
  SUBSTACK_COOKIE?: string;
  SUBSTACK_USER_ID?: string;
}

export function publicationBase(env: Env): string {
  // Accept "name", "@name", "name.substack.com", a custom domain, or a pasted address.
  const pub = env.SUBSTACK_PUBLICATION.trim().replace(/^@/, "").replace(/^https?:\/\//i, "").replace(/\/.*$/, "").toLowerCase();
  return `https://${pub.includes(".") ? pub : `${pub}.substack.com`}`;
}

function cookieHeader(env: Env): string {
  const raw = env.SUBSTACK_COOKIE?.trim();
  if (!raw) {
    throw new Error(
      "No Substack key yet, so draft tools are unavailable (read tools still work). " +
        "Tell the user: open Chrome, make sure the Substack Key Grabber add-on is installed, sign in to Substack, wait a minute, then ask again.",
    );
  }
  // Accept the bare value or a "name=value" string. Substack sessions appear under either cookie name.
  const value = raw.replace(/^(substack|connect)\.sid=/, "");
  return `substack.sid=${value}; connect.sid=${value}`;
}

export async function substackFetch(
  env: Env,
  path: string,
  init: { method?: string; body?: unknown; auth?: boolean; base?: string } = {},
): Promise<any> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": "substack-mcp/0.3",
  };
  if (init.body !== undefined) headers["Content-Type"] = "application/json";
  if (init.auth) {
    headers.Cookie = cookieHeader(env);
    headers.Referer = `${publicationBase(env)}/publish/posts`;
  }

  const res = await fetch(`${init.base ?? publicationBase(env)}${path}`, {
    method: init.method ?? "GET",
    headers,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });

  const text = await res.text();
  if (!res.ok) {
    const hint =
      res.status === 401 || res.status === 403
        ? " (the Substack sign-in has expired, or this account can't edit this publication. Tell the user: sign in to Substack again in Chrome, wait a minute for the add-on to send the new key, then ask again)"
        : "";
    throw new Error(`Substack ${res.status} on ${init.method ?? "GET"} ${path}${hint}: ${text.slice(0, 300)}`);
  }
  return text ? JSON.parse(text) : null;
}

let cachedUserId: number | undefined;

export async function currentUserId(env: Env): Promise<number> {
  if (env.SUBSTACK_USER_ID) return Number(env.SUBSTACK_USER_ID);
  if (cachedUserId) return cachedUserId;
  const profile = await substackFetch(env, "/api/v1/user/profile/self", { auth: true, base: "https://substack.com" });
  if (!profile?.id) throw new Error("Could not determine Substack user id; set SUBSTACK_USER_ID.");
  cachedUserId = profile.id as number;
  return cachedUserId;
}
