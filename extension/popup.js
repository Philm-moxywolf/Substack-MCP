// The popup shows where things stand and lets you send the key right now. Day to day you never need
// it: the background worker (background.js) delivers the key by itself.

const msg = document.getElementById("msg");
const go = document.getElementById("go");
const substackRow = document.getElementById("substack");
const claudeRow = document.getElementById("claude");

function show(text) {
  msg.textContent = text;
}

const RESULTS = {
  sent: "Saved! Claude has your Substack key.",
  up_to_date: "Saved! Claude has your Substack key.",
  signed_out: "You're not signed in to Substack in this browser.\nOpen substack.com, sign in, then click again.",
  claude_closed:
    "Couldn't reach Claude on this Mac.\nOpen the Claude app, start a chat, then click again. (It also sends by itself within a minute.)",
  rejected: "Substack didn't accept this sign-in.\nSign out of Substack, sign in again, then click again.",
  retry: "Couldn't check the key with Substack just now.\nIt will try again by itself in a minute.",
};

async function refresh() {
  const [value, claude] = await Promise.all([readSessionCookie().catch(() => null), claudeIsListening()]);
  substackRow.textContent = value ? "✅ Signed in to Substack" : "❌ Not signed in to Substack in this browser";
  claudeRow.textContent = !claude
    ? "❌ Claude isn't open on this Mac"
    : claude.hasKey
      ? "✅ Claude is open and has a key"
      : "⏳ Claude is open, waiting for your key";
  return { value, claude };
}

go.addEventListener("click", async () => {
  go.disabled = true;
  show("Sending...");
  let state;
  try {
    state = await sendKey({ force: true });
  } catch (e) {
    show("Something went wrong: " + e.message);
    go.disabled = false;
    return;
  }
  if (state === "signed_out") {
    // Show what we can see, so a naming/domain surprise is obvious rather than a dead end.
    const seen = (await substackCookies().catch(() => [])).map((c) => c.name);
    show(RESULTS.signed_out + (seen.length ? "\n(Cookies I can see: " + seen.join(", ") + ")" : ""));
  } else {
    show(RESULTS[state] || "Unexpected result: " + state);
  }
  await refresh();
  go.disabled = false;
});

refresh().then(({ value, claude }) => {
  if (value && claude && claude.hasKey) show("All set. This works by itself: you don't need to click anything.");
  else if (!value) show("Sign in to Substack in this browser. The key is then sent to Claude by itself.");
  else if (!claude) show("Open the Claude app. The key is then sent by itself within a minute.");
  else show("Click the button to send your key now, or wait a minute and it sends by itself.");
});
