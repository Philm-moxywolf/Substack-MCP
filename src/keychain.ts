// The Substack session key lives in the macOS Keychain, never in a file.

import { execFileSync } from "node:child_process";

const SERVICE = "substack-mcp";
const ACCOUNT = "substack.sid";
const CACHE_MS = 3000; // one tool call can ask several times; don't shell out for each

let cached: { value: string | undefined; at: number } | undefined;

/** The saved key, or undefined if there isn't one. Read fresh, so a new key works without restarting Claude. */
export function readKey(): string | undefined {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.value;
  let value: string | undefined;
  try {
    value =
      execFileSync("security", ["find-generic-password", "-s", SERVICE, "-a", ACCOUNT, "-w"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      }).trim() || undefined;
  } catch {
    value = undefined; // read tools still work without it
  }
  cached = { value, at: Date.now() };
  return value;
}

export function saveKey(value: string): void {
  execFileSync("security", ["add-generic-password", "-U", "-s", SERVICE, "-a", ACCOUNT, "-w", value], {
    stdio: "ignore",
  });
  cached = { value, at: Date.now() };
}
