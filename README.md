# AI Stack Intelligence Dashboard

A lightweight, single-page dashboard for tracking AI tool updates across your stack — with a focus on what each update actually means for how you work.

## Overview

Tracks recent updates across Claude, Notion, Figma, Linear, Slack, and OpenAI. Each card surfaces a change, describes it, and explains its practical implication. Cross-tool cards highlight workflows that become possible when tools are combined.

## Features

- **Filter by tool** — Claude, Notion, Figma, Linear, Slack, OpenAI, or Cross-tool
- **Search** — full-text search across titles, descriptions, and tags
- **Impact levels** — High impact / Medium impact / Worth watching
- **List and grid views**
- **Add Update modal** — add custom cards that persist via `localStorage`
- **Stats bar** — live counts for total updates, high-impact items, cross-tool unlocks, and tools covered

## Stack

Pure HTML, CSS, and vanilla JavaScript. No build step, no dependencies, no framework.

| File | Purpose |
|------|---------|
| `index.html` | Markup, static card content, modal |
| `styles.css` | All styling, layout, and theme |
| `app.js` | Filter, search, view toggle, modal, localStorage persistence |

## Running locally

Open `index.html` directly in a browser — no server required.

```bash
open index.html
```

Or serve it locally:

```bash
npx serve .
# or
python3 -m http.server
```

## Adding updates

Click **+ Add Update** in the toolbar to add a card via the modal. Cards are saved to `localStorage` and persist across page reloads.

To add updates that survive a cache clear, add them directly as `<div class="card">` elements in the `#cards-container` section of `index.html`.

## Tools covered

| Tool | Coverage |
|------|----------|
| Claude | Cowork Skills, MCP connectors, Sonnet 4.6, scheduled tasks, memory |
| Notion | AI Agents 3.0, Custom Agents, Notion Mail, Google + Calendar search |
| Figma | MCP Server GA, Figma Make, Make Extensibility / custom MCPs |
| Linear | AI coding agent deeplink, Product Intelligence triage |
| OpenAI | GPT-5.2/5.3, ChatGPT Projects with Slack + Drive |
| Cross-tool | Claude + Notion, Claude + Figma MCP, Claude + Linear workflows |
