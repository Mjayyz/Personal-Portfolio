# AGENTS.md

This file provides guidance to Codex when working with code in this repository.

## Running Locally

No build step required — this is a static HTML/CSS/JS site.

```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

## Deployment

Pushing to `main` automatically deploys to GitHub Pages via `.github/workflows/static.yml`. No manual deploy needed.

## Architecture

Custom static portfolio site. Pages live in `pages/`; a root `index.html` exists solely to redirect there for GitHub Pages compatibility.

- **`pages/index.html`** — Home: hero, impact metrics, featured projects, contact form
- **`pages/about.html`** — Resume: bio, timeline, skills grid
- **`pages/elements.html`** — Games: browser-playable canvas games

JavaScript files in `assets/js/`:
- `site.js` — theme toggle, hamburger nav, scroll progress, reveal animations (custom)
- `chatbot.js` — floating AI chat widget (custom backend integration)
- `games.js` — canvas game engine for Tetris and Road Racer
- `main.js` — legacy template boilerplate (not loaded by any page)

### Chatbot

The chatbot widget (`assets/js/chatbot.js`) is the only dynamic backend integration:

- Renders a floating widget in the bottom-right corner on `index.html` and `about.html`
- POSTs to an AWS Lambda endpoint (URL stored in `chatbot.config.js`, not in source)
- Sends `{ input, session_id }` and expects `{ message }` in response
- Session ID is persisted in `localStorage` across page visits

**Secret management:** `assets/js/chatbot.config.js` is gitignored. In CI, it is generated from GitHub Secrets (`CHATBOT_API_ENDPOINT`, `CHATBOT_API_KEY`) by the "Inject secrets" step in `.github/workflows/static.yml`. For local development, copy `assets/js/chatbot.config.template.js` to `assets/js/chatbot.config.js` and fill in the real values.

### Contact Form

All three pages use [Web3Forms](https://web3forms.com/) for the contact form (no backend needed). The access key is stored as GitHub Secret `WEB3FORMS_KEY` and injected at deploy time via:

```bash
sed -i "s|__WEB3FORMS_KEY__|${WEB3FORMS_KEY}|g" pages/index.html pages/about.html pages/elements.html
```

The placeholder `__WEB3FORMS_KEY__` appears in source.

### Styles

`assets/css/main.css` is the base stylesheet (~95 KB, originally from the Solid State HTML5 UP template). `assets/css/design.css` is the custom layer — all site-specific styles live here. The `assets/sass/` directory contains SCSS source but is not part of any build pipeline; edit `main.css` or `design.css` directly.
