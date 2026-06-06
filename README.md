# 🛡️ Ghassil — Haram Blocker (غَسِّل)

A Chrome/Brave/Edge (Manifest V3) browser extension that helps you lower your gaze online.

## What it blocks
- **Haram websites** — a default list of adult/gambling sites, plus any sites you add.
- **Explicit search queries** — blocks searches containing profanity or sexual keywords on Google, Bing, DuckDuckGo, Yahoo, Yandex.
- **Inappropriate images** — blurs images whose alt/title/src match flagged keywords (click to reveal).
- **Custom sites** — add any domain to block from the popup.

When blocked, you're redirected to a calm reminder page with an ayah on lowering the gaze.

## Install (Developer mode)
1. Open `chrome://extensions` (or `brave://extensions`, `edge://extensions`).
2. Turn on **Developer mode** (top-right).
3. Click **Load unpacked** → select this `Ghassil` folder.
4. Pin the 🛡️ icon. Toggle protection + add sites from the popup.

## Files
| File | Purpose |
|---|---|
| `manifest.json` | MV3 manifest |
| `background.js` | blocks sites + explicit searches (webNavigation) |
| `content.js` | blurs flagged images |
| `lists.js` | default site + keyword lists |
| `popup.html/js` | toggle, stats, add/remove custom sites |
| `blocked.html` | the block page |

Built for the sake of Allah.
