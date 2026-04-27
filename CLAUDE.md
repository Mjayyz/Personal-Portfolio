# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running Locally

No build step required — this is a static HTML/CSS/JS site.

```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

## Deployment

Pushing to `main` automatically deploys to GitHub Pages via `.github/workflows/static.yml`. No manual deploy needed.

## Architecture

Static portfolio site built on the [Solid State HTML5 UP template](https://html5up.net/solid-state). Two main pages:

- **`index.html`** — Home: hero section, three content sections, featured projects, contact form
- **`about.html`** — Resume: job history and accomplishments

JavaScript files in `assets/js/`:
- `main.js` — menu toggle and scroll behavior (template boilerplate)
- `chatbot.js` — floating chat widget (the only custom-built interactive feature)

### Chatbot

The chatbot widget (`assets/js/chatbot.js`) is the only dynamic backend integration:

- Renders a floating widget in the bottom-right corner of both pages
- POSTs to an AWS Lambda endpoint (URL stored in `chatbot.config.js`, not in source)
- Sends `{ input, session_id }` and expects `{ message }` in response
- Session ID is persisted in `localStorage` across page visits

**Secret management:** `assets/js/chatbot.config.js` is gitignored. In CI, it is generated from GitHub Secrets (`CHATBOT_API_ENDPOINT`, `CHATBOT_API_KEY`) by the "Inject secrets" step in `.github/workflows/static.yml`. For local development, copy `assets/js/chatbot.config.template.js` to `assets/js/chatbot.config.js` and fill in the real values.

### Contact Form

Both pages use [Web3Forms](https://web3forms.com/) for the contact form (no backend needed). The access key is stored as GitHub Secret `WEB3FORMS_KEY` and injected into the HTML at deploy time. The placeholder `__WEB3FORMS_KEY__` appears in source.

### Styles

`assets/css/main.css` is the single compiled stylesheet (~95 KB). The `assets/sass/` directory contains the SCSS source but is not part of any build pipeline — edits should go directly to `main.css`.
