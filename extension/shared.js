// Shared by the background worker and the popup.
//
// Reads the Substack session cookie from THIS browser (where you're signed in) and sends it to the
// substack-mcp server on your own Mac (127.0.0.1), which checks it with Substack and saves it to your
// Keychain. The key goes nowhere else.

const ENDPOINT = "http://127.0.0.1:8789";

// The cookies API can read httpOnly cookies, including ones the browser only holds in memory.
// We cast a wide net: every substack.com subdomain, plus the "partitioned" drawer that newer
// browsers file some cookies into (which a plain lookup skips).
async function substackCookies() {
  const queries = [
    { domain: "substack.com" },
    { domain: "substack.com", partitionKey: { topLevelSite: "https://substack.com" } },
    { url: "https://substack.com/", partitionKey: { topLevelSite: "https://substack.com" } },
  ];
  const seen = new Map();
  for (const q of queries) {
    let list = [];
    try {
      list = await chrome.cookies.getAll(q);
    } catch {
      /* some browsers reject partitionKey; just skip that query */
    }
    for (const c of list) {
      if (c && c.value) seen.set(c.domain + "|" + c.name + "|" + (c.partitionKey ? "p" : ""), c);
    }
  }
  return [...seen.values()];
}

async function readSessionCookie() {
  const all = await substackCookies();
  for (const name of ["substack.sid", "connect.sid"]) {
    const hit = all.find((c) => c.name === name);
    if (hit) return hit.value;
  }
  return null;
}

// We remember a fingerprint of the last key we delivered, never the key itself.
async function fingerprint(text) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function remember(state, extra = {}) {
  await chrome.storage.local.set({ lastState: state, lastAt: Date.now(), ...extra });
  return state;
}

// Sends the key if there is anything new to send. Returns one of:
//   "sent"          delivered and saved
//   "up_to_date"    this key was already delivered
//   "signed_out"    no Substack sign-in in this browser
//   "claude_closed" nothing is listening on this Mac (Claude isn't open, or the extension isn't installed there)
//   "rejected"      Substack says this key isn't a signed-in session
//   "retry"         couldn't check right now; will try again
// force: send even if this key was delivered or rejected before (the popup button, or browser start-up).
async function sendKey({ force = false } = {}) {
  const value = await readSessionCookie();
  if (!value) return remember("signed_out");

  const print = await fingerprint(value);
  const { sentPrint, rejectedPrint } = await chrome.storage.local.get(["sentPrint", "rejectedPrint"]);
  if (!force && print === sentPrint) return "up_to_date";
  if (!force && print === rejectedPrint) return "rejected";

  let res;
  try {
    res = await fetch(ENDPOINT + "/key", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
  } catch {
    return remember("claude_closed");
  }
  const body = await res.json().catch(() => ({}));
  if (res.ok && body.ok) return remember("sent", { sentPrint: print, rejectedPrint: null });
  if (res.status === 400) return remember("rejected", { rejectedPrint: print });
  return remember("retry");
}

async function claudeIsListening() {
  try {
    const res = await fetch(ENDPOINT + "/status");
    const body = await res.json();
    return body && body.app === "substack-mcp" ? body : null;
  } catch {
    return null;
  }
}
