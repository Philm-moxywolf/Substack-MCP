# Substack for Claude

This lets Claude write drafts in your Substack for you.

You talk to Claude. Claude writes the draft. The draft appears in your Substack. You read it, and if you like it, you press Publish.

**Claude can never publish anything or email your readers. Only you can do that.**

Once it's set up, you can ask Claude things like:

- "Turn these notes into a Substack draft."
- "Rewrite the start of my latest draft."
- "What have I written about pricing?"

---

# Setup guide

Setup takes about 10 minutes, and you only do it once. There is no typing of commands. Do the parts in order.

## Before you start: what you need

- **A Mac.** This doesn't work on Windows.
- **The Claude desktop app.** Part 1 shows you how to get it. (The claude.ai website and the phone app can't use this.)
- **Google Chrome.** Safari won't work for this. Chrome is free at `google.com/chrome`.
- **A Substack account** you can sign in to. The email sign-in link is fine. You don't need a password.

## How to read these steps

- **"Click"** means press the left side of your mouse or trackpad once.
- **"Double-click"** means click twice, quickly.
- **"Press Enter"** means press the big key on the right of your keyboard marked **return** or **Enter**.
- **"Cmd"** is the key marked **⌘ command**, on either side of the space bar.
- **"Cmd + Q"** means hold down **Cmd**, press **Q** once, then let go of both.

---

## Part 1: Get the Claude app

If you already have the Claude app on this Mac and you're signed in, skip to Part 2.

1. Open your web browser.
2. Click the address bar at the top, type `claude.ai/download` and press **Enter**.
3. Download the Mac version and install it the way the page tells you.
4. Open **Claude** and sign in.

---

## Part 2: Download this project

1. Click this link: **[Download the project](https://github.com/Philm-moxywolf/Substack-MCP/archive/refs/heads/main.zip)**. A file downloads.
2. Open your **Downloads** folder. One way is to click the **Finder** icon (the blue smiling face) at the bottom of your screen, then click **Downloads** on the left.
3. Find **Substack-MCP-main**. If it ends in **.zip**, double-click it once. A folder with the same name appears next to it.
4. **Drag the Substack-MCP-main folder onto Documents** in the list on the left of the Finder window.

**The folder now lives in Documents and must stay there.** If you move or delete it later, this stops working.

---

## Part 3: Add Substack to Claude

1. In Finder, click **Documents**, then double-click the **Substack-MCP-main** folder to open it.
2. Double-click the file called **Substack.mcpb**. The Claude app opens and shows an extension called **Substack**.
3. Click **Install**.
4. Claude asks for **Your Substack name**. Type the first part of your Substack address.
   - If your Substack is `janesmith.substack.com`, type `janesmith`.
   - Not sure? Open your Substack in Chrome and look at the address bar.
   - If you use your own web address, like `news.janesmith.com`, type that instead.
5. Click **Save** (or **Install**, if that's the button you see).

**If double-clicking the file doesn't open Claude:** open Claude yourself, click your name in the bottom-left corner, click **Settings**, then **Extensions**, and drag the **Substack.mcpb** file into that window.

---

## Part 4: Add the Substack Key Grabber to Chrome

Claude needs a **key** that proves to Substack it's you. Chrome already has it, because you sign in to Substack there. This small add-on hands it to Claude on your Mac, by itself, whenever it changes.

1. Open **Chrome**.
2. Click the address bar, type `chrome://extensions` and press **Enter**.
3. Turn on **Developer mode**. It's a switch at the top right. **Leave it on.** The add-on stops working if you turn it off.
4. Click **Load unpacked**. A window opens to pick a folder.
5. Click **Documents** on the left, double-click **Substack-MCP-main**, click once on **extension**, then click **Select**.
6. **Substack Key Grabber** now shows in the list.
7. Pin it so it's easy to find. Click the **puzzle piece** icon at the top right of Chrome, then click the **pin** next to Substack Key Grabber. A small **S** icon appears in the toolbar.

---

## Part 5: Sign in to Substack

1. In Chrome, go to `substack.com` and **sign in**, the way you normally do. If you're already signed in, you don't need to do anything.
2. Make sure the Claude app is open.
3. Click the **S** icon in Chrome's toolbar. Within a minute it should show both of these:
   - **✅ Signed in to Substack**
   - **✅ Claude is open and has a key**

If the second line isn't a tick yet, click **Send my key to Claude now**. It says **Saved! Claude has your Substack key.**

---

## Part 6: Try it

1. In the Claude app, start a new chat.
2. Type this and press **Enter**: `List my Substack drafts`
3. The first time, Claude asks permission to use a Substack tool. Click **Allow** (or **Always allow**, so it stops asking).

If Claude shows your drafts, everything works. If you have no drafts yet, it may say there aren't any, which is fine too.

**That's the whole setup. From now on there is nothing to maintain.** If Substack ever signs you out, Claude will tell you. Sign in to Substack in Chrome as usual, wait a minute, and ask Claude again.

---

## Part 7: Use it in a Claude Project

A **Project** is a space in Claude with its own instructions and files. Set one up for your newsletter and Claude will remember your voice and your rules in every chat inside it.

**Where it works:** in the **Claude desktop app on the Mac where you did the setup**, in normal chats and in Projects. It does **not** work on the claude.ai website, the phone app, or another computer, because it runs on your Mac.

### Set up the Project (once)

1. In the Claude desktop app, click **Projects** in the left sidebar.
2. Click **New project**. Name it something like **My Substack** and create it.
3. Find the project's **instructions** box and paste the text below into it. Change the first line to your newsletter's name.

   ```text
   You help me write my Substack newsletter, [YOUR NEWSLETTER NAME].

   Tools: you have Substack tools. Use them, don't guess.
   - To learn my voice, use search_posts and get_post to read 2–3 of my published posts on a related topic before you draft.
   - Save every piece as a Substack draft with create_draft, then give me the editUrl.
   - To change an existing draft, use get_draft first, then update_draft with the complete new body (update_draft replaces the whole body).
   - Write the body in Markdown: short paragraphs, ## headings, bullet lists and links. Don't repeat the title in the body.
   - Audience is "everyone" unless I say otherwise ("only_paid", "only_free" or "founding").

   Rules:
   - You can't publish or email anyone. Never say a post is published or sent. I review the draft in Substack and press Publish myself.
   - Never put anything from my Substack key or settings into a chat.
   ```

4. Optional: add files that help, such as a style guide, your About page, or a few of your favourite posts.

### Use it

Open the Project and start a chat inside it. For example:

- "Here are my notes from today's call. Turn them into a draft post called 'What I learned about pricing'."
- "Read my last three posts and tell me which topics I keep coming back to."
- "Open my latest draft and tighten the first two paragraphs."

Claude saves the draft and gives you a link. Open it in Substack, read it, edit anything you like, and press Publish when you're happy.

---

# Keep your key secret

The add-on hands Claude a **key** that lets it act as you on Substack. It's like the key to your house.

- It's stored in your Mac's **Keychain**, where your Mac keeps passwords. The add-on only ever sends it to your own Mac.
- **Never send it to anyone, paste it into a chat, or share a screenshot of it.** That includes the person who sent you this guide. Nothing in this setup ever asks you to look at it.
- If you think someone has seen it, sign out of Substack on every device. That makes the old key stop working. Then sign in again in Chrome, and the add-on sends Claude the new one.

---

# If something goes wrong

Click the **S** icon in Chrome first. It tells you what's wrong.

**It says "❌ Not signed in to Substack in this browser"**
Go to `substack.com` in Chrome and sign in. Then click the **S** icon again.

**It says "❌ Claude isn't open on this Mac"**
Open the Claude app and start a chat. If it still says this, quit Claude with **Cmd + Q**, open it again, and check that Substack is installed: click your name in the bottom-left corner of Claude, then **Settings**, then **Extensions**. If Substack isn't there, do Part 3 again.

**It says "Substack didn't accept this sign-in"**
Sign out of Substack in Chrome, sign in again, then click **Send my key to Claude now**.

**Claude says there is no Substack key yet, or that the sign-in has expired**
Sign in to Substack in Chrome, wait a minute, and ask Claude again. You don't need to restart anything.

**Claude says it can't find a Substack, or shows the wrong one**
The Substack name was typed wrong. In Claude, click your name in the bottom-left corner, then **Settings**, then **Extensions**, open **Substack**, and correct the name.

**Claude doesn't seem to have any Substack tools**
Quit Claude with **Cmd + Q** and open it again. In a chat, open the tools menu (the button next to where you type) and check **Substack** is switched on.

**The S icon has disappeared from Chrome, or Chrome says the add-on is turned off**
Go to `chrome://extensions`. Make sure **Developer mode** is on and **Substack Key Grabber** is switched on. If it says the folder is missing, the **Substack-MCP-main** folder was moved out of Documents: put it back, or do Part 4 again.

**"Too many requests"**
Substack wants you to slow down. Wait an hour and try again.

---

# Getting a newer version

This doesn't update itself. If the person who sent you this says there's a new version, or it stops working after Substack changes something:

1. Do **Part 2** again. When your Mac asks, choose **Replace** so the new folder takes the place of the old one in Documents.
2. Do **Part 3** again (double-click the new **Substack.mcpb** and install it).
3. In Chrome, go to `chrome://extensions` and click the **round arrow** on Substack Key Grabber.

---

# For the technically curious

**This is unofficial.** Substack has no public way to write drafts, so this uses the same private route Substack's own website uses, signed in as you. It can stop working when Substack changes its website, and it has done so before. You use it at your own risk, on your own account.

| Tool | What it does |
|---|---|
| `list_posts` | Lists published posts |
| `search_posts` | Searches published posts |
| `get_post` | Reads a post's full text |
| `list_drafts` | Lists your drafts |
| `get_draft` | Reads a draft |
| `create_draft` | Creates a draft from Markdown |
| `update_draft` | Edits a draft (refuses published posts) |

- **Substack.mcpb** is a Claude desktop extension: a local MCP server that Claude starts over stdio, using the Node.js built into the Claude app. Your key never leaves your Mac except in requests to Substack.
- Your key is stored in macOS Keychain (service `substack-mcp`, account `substack.sid`), never in a file. The server reads it fresh for each request, so a new key works without restarting Claude.
- Why an add-on: Substack's session cookie is httpOnly and partitioned, and it isn't in the browser's cookie files on disk. The add-on reads it through the browser's cookies API and posts it to `127.0.0.1:8789`, where the server listens while Claude is open. The server refuses requests from web pages and saves a key only if Substack confirms it's a signed-in session.
- The add-on sends the key when Chrome starts, when your Substack sign-in changes, and once a minute while a new key is waiting to be delivered. It remembers a fingerprint of the last key it delivered, never the key.
- Installing with Terminal, using it with Claude Code, entering a key by hand and building from source are in **[ADVANCED.md](ADVANCED.md)**.

## Remove it

1. In Claude, click your name in the bottom-left corner, then **Settings**, then **Extensions**, and remove **Substack**.
2. In Chrome, go to `chrome://extensions` and click **Remove** on Substack Key Grabber.
3. Delete the **Substack-MCP-main** folder from Documents.
4. To remove your key from Keychain, open **Terminal** (press **Cmd + Space**, type `Terminal`, press **Enter**), paste this and press **Enter**:

   ```bash
   security delete-generic-password -s substack-mcp -a substack.sid
   ```
