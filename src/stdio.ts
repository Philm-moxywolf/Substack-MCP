// Local MCP server for Claude: newline-delimited JSON-RPC over stdin/stdout.
// Runs on your own Mac so Substack sees your own connection. The session key comes from the macOS
// Keychain, never a file; while this runs it also listens for the browser add-on to deliver a new one.

import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createInterface } from "node:readline";
import { startKeyListener } from "./keyListener";
import { readKey } from "./keychain";
import { handle, type JsonRpcRequest } from "./server";
import { publicationBase, type Env } from "./substack";

// The Claude extension passes the name you typed at install; the Terminal installer writes config.json.
function loadPublication(): string {
  const fromEnv = process.env.SUBSTACK_PUBLICATION?.trim();
  if (fromEnv && !fromEnv.includes("${")) return new URL(publicationBase({ SUBSTACK_PUBLICATION: fromEnv })).host;
  try {
    const path = join(homedir(), ".config", "substack-mcp", "config.json");
    return JSON.parse(readFileSync(path, "utf8")).publication;
  } catch {
    process.stderr.write("substack-mcp: no Substack name is set. Add it in the extension's settings in Claude.\n");
    process.exit(1);
  }
}

const env: Env = {
  SUBSTACK_PUBLICATION: loadPublication(),
  SUBSTACK_USER_ID: process.env.SUBSTACK_USER_ID,
  // Read on every use, so a key the add-on just delivered works without restarting Claude.
  get SUBSTACK_COOKIE() {
    return readKey();
  },
};

if (!process.env.SUBSTACK_NO_LISTENER) startKeyListener();

// Claude closing its side mid-reply is a normal way to stop, not a crash.
process.stdout.on("error", () => process.exit(0));

const pending = new Set<Promise<void>>();

createInterface({ input: process.stdin }).on("line", (line) => {
  if (!line.trim()) return;
  const task = (async () => {
    let reply: object | null;
    try {
      reply = await handle(JSON.parse(line) as JsonRpcRequest, env);
    } catch {
      reply = { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } };
    }
    if (reply) process.stdout.write(JSON.stringify(reply) + "\n");
  })().finally(() => pending.delete(task));
  pending.add(task);
});
