# Substack Key Grabber (Chrome add-on)

Keeps Claude on your Mac supplied with your Substack key, by itself. No Developer Tools, nothing to copy, and normally nothing to click.

Works in **Google Chrome** and **Microsoft Edge**. The step-by-step install is **Part 4 of the main [README](../README.md)**.

## Why it exists

Claude needs the key that proves to Substack it's you. Substack keeps that key (the `substack.sid` cookie) locked away from web pages, and it isn't saved in the browser's cookie files on disk. A browser add-on is allowed to read it through the browser's official cookies API, so this one does exactly that.

## What it does

1. It reads your Substack sign-in key from this browser.
2. It sends it to `127.0.0.1:8789`, which is your own Mac, where the Substack extension inside the Claude app is listening.
3. That extension checks with Substack that the key really is a signed-in session, then saves it to your Mac's Keychain.

It does this when Chrome starts, when your Substack sign-in changes, and once a minute while a new key is still waiting to be delivered (for example because Claude wasn't open yet). Clicking **Send my key to Claude now** in the popup does it straight away.

## Is it safe?

- It only reads Substack cookies, and it only sends them to your own Mac. Nothing goes to the internet except Substack itself.
- It remembers a fingerprint of the last key it delivered, so it knows when there's a new one. It never stores the key.
- The listener on your Mac refuses requests from web pages, and saves a key **only if** Substack confirms it's a real signed-in session.
- The code is five short files in this folder: `manifest.json`, `background.js`, `shared.js`, `popup.html` and `popup.js`. Anyone technical can read them in a few minutes.
