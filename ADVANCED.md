# Advanced: Terminal install, Claude Code, and building from source

Most people should follow the main [README](README.md), which needs no Terminal. This page is for people who want to use this with **Claude Code**, install it from source, or change it.

## Install with Terminal

This builds the server from source and connects it to both the Claude desktop app and Claude Code.

You need **Node.js 20 or newer** (the LTS version from `nodejs.org`) and **git**.

1. Download the project and go into it:

   ```bash
   git clone https://github.com/Philm-moxywolf/Substack-MCP.git ~/substack-mcp
   ```

   ```bash
   cd ~/substack-mcp
   ```

2. Add the Substack Key Grabber to Chrome (Part 4 of the README, choosing the `extension` folder inside `~/substack-mcp`) and sign in to Substack.

3. Run the installer:

   ```bash
   ./install.sh
   ```

   - **1 of 4: Building...** Wait a minute or two.
   - **2 of 4: Your Substack.** Type the first part of your Substack address and press **Enter**.
   - **3 of 4: Your Substack key.** At **Use the browser add-on? [Y/n]** press **Enter**. It says **Ready. Waiting for the Substack Key Grabber add-on in your browser.** The add-on delivers the key within a minute. To hurry it, click the add-on, then **Send my key to Claude now**.
   - **4 of 4: Connecting to Claude.** It says **Connected**, then **All done.**

4. Quit Claude with **Cmd + Q**, open it again, and ask: `List my Substack drafts`.

Pass `--no-connect` to skip changing Claude's settings. Don't install both this way and with **Substack.mcpb**: you'd get every tool twice.

What the installer changes:

- Saves your Substack name in `~/.config/substack-mcp/config.json`.
- Saves your key in macOS Keychain (service `substack-mcp`, account `substack.sid`).
- Adds a `substack` entry under `mcpServers` in `~/Library/Application Support/Claude/claude_desktop_config.json` and in `~/.claude.json` (Claude Code), keeping a backup ending in `.bak-substack`.

## Commands

| Command | What it does |
|---|---|
| `npm run build` | Builds the server to `dist/substack-mcp.mjs` |
| `npm run pack` | Builds the one-click Claude extension, `Substack.mcpb` |
| `npm run typecheck` | Checks the TypeScript |
| `npm run grab:ext` | Waits for the add-on to deliver a key, without Claude open |
| `npm run paste-key` | Saves a key you copied by hand (below) |
| `npm run grab` | Opens a fresh sign-in window. Only works for accounts with a Substack password, because Substack won't send a sign-in link to an automated browser |

## Get your key by hand

Only use this if the add-on doesn't work for you. It works in Chrome and Edge.

1. In Chrome or Edge, sign in to Substack.
2. Click the address bar, type `yourname.substack.com/publish/posts` (using your Substack name) and press **Enter**.
3. In the menu bar at the very top of your screen, click **View**, then **Developer**, then **Developer Tools**. A panel opens.
4. In the row of words at the top of that panel, click **Network**. If you can't see it, click **>>** at the end of the row, then **Network**.
5. Just below, click **Fetch/XHR**.
6. Press **Cmd + R**. A list of rows appears.
7. Click any row that shows **200** in the **Status** column.
8. On the right, click **Headers**, then scroll down to **Request Headers**.
9. Find the long line called **Cookie**. Look in it for `substack.sid=`. If it isn't there, look for `connect.sid=`.
10. Select only the part **after** the `=`, up to but not including the next `;`. It starts with `s%3A`. Right-click it and choose **Copy**.
11. In Terminal, paste this and press **Enter**:

    ```bash
    cd ~/substack-mcp && npm run paste-key
    ```

12. When it asks, press **Cmd + V**, then **Enter**. Nothing shows as you paste. That's normal. It checks the key with Substack before saving it, and says **Saved.**

## How the pieces fit

- `src/` is the MCP server. `stdio.ts` is the entry point, `server.ts` handles the protocol, `tools.ts` defines the seven tools, `substack.ts` talks to Substack, `format.ts` converts Markdown, `keychain.ts` reads and saves the key, and `keyListener.ts` is the listener on `127.0.0.1:8789` that the add-on delivers the key to.
- `extension/` is the Chrome add-on. `background.js` sends the key by itself; `popup.js` shows the status and a send-now button; `shared.js` holds what both use.
- `claude-extension/manifest.json` describes the one-click Claude extension. `npm run pack` bundles the server into it and writes `Substack.mcpb`.
- `scripts/` holds the Terminal-only helpers used by `install.sh` and the commands above.

When Substack changes its private API, the fix goes in `src/`. Then run `npm run pack` and commit the new `Substack.mcpb`, so people who installed the easy way can download it again.
