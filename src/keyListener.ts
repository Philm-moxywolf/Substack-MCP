// Listens on this Mac only (127.0.0.1) for the Substack Key Grabber browser add-on, which sends the
// Substack session key whenever it changes. A key is saved only if Substack confirms it is a real
// signed-in session. Web pages are refused outright; only the add-on (or a local tool) may talk to it.

import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { readKey, saveKey } from "./keychain";

const PORT = 8789;
const RETRY_MS = 30_000;
const PROFILE_URL = "https://substack.com/api/v1/user/profile/self";

function log(msg: string) {
  process.stderr.write(`substack-mcp: ${msg}\n`); // stdout belongs to the MCP protocol
}

/** true = signed in, false = Substack says no, undefined = couldn't reach Substack. */
async function isSignedIn(value: string): Promise<boolean | undefined> {
  try {
    const res = await fetch(PROFILE_URL, {
      headers: { Cookie: `substack.sid=${value}; connect.sid=${value}`, Accept: "application/json" },
    });
    if (!res.ok) return res.status >= 500 || res.status === 429 ? undefined : false;
    const body = (await res.json()) as { id?: number };
    return Boolean(body?.id);
  } catch {
    return undefined;
  }
}

function reply(res: ServerResponse, status: number, body: object) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 100_000) req.destroy(); // no reason for a key to be this big
    });
    req.on("end", () => resolve(data));
    req.on("error", () => resolve(""));
  });
}

async function onRequest(req: IncomingMessage, res: ServerResponse) {
  const origin = req.headers.origin ?? "";
  if (/^https?:\/\//i.test(origin)) return reply(res, 403, { ok: false, error: "web pages may not use this" });
  if (origin.startsWith("chrome-extension://")) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  }
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }
  if (req.method === "GET" && req.url === "/status") {
    return reply(res, 200, { ok: true, app: "substack-mcp", hasKey: Boolean(readKey()) });
  }
  if (req.method !== "POST" || req.url !== "/key") return reply(res, 404, { ok: false });

  let value = "";
  try {
    const parsed = JSON.parse(await readBody(req));
    if (typeof parsed?.value === "string") value = parsed.value.replace(/^(substack|connect)\.sid=/, "").trim();
  } catch {
    /* fall through to the empty-value reply */
  }
  if (!value || /\s/.test(value)) return reply(res, 400, { ok: false, error: "that isn't a Substack key" });

  // Same key as before: nothing to do, and no need to bother Substack.
  if (value === readKey()) return reply(res, 200, { ok: true, unchanged: true });

  const signedIn = await isSignedIn(value);
  if (signedIn === undefined) return reply(res, 503, { ok: false, error: "couldn't reach Substack to check the key" });
  if (!signedIn) return reply(res, 400, { ok: false, error: "that isn't a signed-in Substack session" });

  try {
    saveKey(value);
  } catch {
    return reply(res, 500, { ok: false, error: "couldn't save to Keychain" });
  }
  log("new Substack key saved to Keychain");
  return reply(res, 200, { ok: true });
}

export function startKeyListener(): void {
  const server = createServer((req, res) => {
    onRequest(req, res).catch(() => reply(res, 500, { ok: false }));
  });
  const listen = () => server.listen(PORT, "127.0.0.1");
  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      // Another copy of this server (a second Claude window, say) already has the port. Take over if it goes away.
      setTimeout(listen, RETRY_MS).unref();
    } else {
      log(`key listener is off (${err.code ?? err.message}); the add-on can't deliver a key to this copy`);
    }
  });
  server.unref(); // never keep the process alive once Claude has closed its side
  listen();
}
