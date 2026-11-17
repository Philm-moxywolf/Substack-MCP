// Keeps the substack-mcp server on this Mac supplied with your current Substack key, with no clicks.
// It tries when the browser starts, when your Substack sign-in changes, and once a minute if a new
// key is still waiting to be delivered (for example because Claude wasn't open yet).

importScripts("shared.js");

const RETRY_ALARM = "deliver-key";

function ensureAlarm() {
  chrome.alarms.get(RETRY_ALARM, (alarm) => {
    if (!alarm) chrome.alarms.create(RETRY_ALARM, { periodInMinutes: 1 });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  ensureAlarm();
  sendKey({ force: true });
});

chrome.runtime.onStartup.addListener(() => {
  ensureAlarm();
  sendKey({ force: true });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== RETRY_ALARM) return;
  const state = await sendKey(); // does nothing unless a new key is waiting
  if (state !== "up_to_date") return;
  // We delivered this key before, but if the Mac has since lost it (a fresh install, say), send it again.
  const claude = await claudeIsListening();
  if (claude && !claude.hasKey) await sendKey({ force: true });
});

// Signing in to Substack sets several cookies in a burst; wait for it to settle, then send once.
let settle;
chrome.cookies.onChanged.addListener(({ cookie, removed }) => {
  if (removed || !/(^|\.)substack\.com$/.test(cookie.domain)) return;
  if (cookie.name !== "substack.sid" && cookie.name !== "connect.sid") return;
  clearTimeout(settle);
  settle = setTimeout(() => sendKey(), 2000);
});

ensureAlarm();
