# Keeper of Stories — Lisieux Titan

A complete, static digital exhibition for the Keeper of Stories student robotics project. HTML, CSS and a small amount of vanilla JavaScript; no external runtime libraries or API keys.

## Local preview

Run `npm start` (or `node scripts/serve.mjs`), then open `http://127.0.0.1:4173`. The production files are in `dist/`; they can be served by any static host. Run `npm run validate` for asset, anchor and JavaScript checks.

## Content and assets

- All five documentary photographs were supplied by Lisieux Titan: final Keeper, early LEGO prototype, Nationals sign, exhibition booth, and team.
- Competition details and project capabilities follow the supplied project brief. No names have been inferred from photographs.
- The conversation is a curated demonstration, not a live robot connection. Its Madhubani notes cite the District Administration of Madhubani.
- The school crest was supplied by the user. Its exterior background was removed with built-in ImageGen. The tiny original was enlarged during that process; it is not a vector or a pixel-identical archival master.
- Cormorant Garamond and DM Sans are self-hosted; their OFL licenses are in `dist/assets/fonts/`.

## Editing

`dist/index.html` contains the exhibition narrative and metadata; `dist/style.css` controls its responsive layout; `dist/script.js` provides navigation, the illustrative conversation, cultural strip, comparison and scroll reveals. All narrative content remains readable without JavaScript, and reduced motion is respected.

The Sites project identity lives in `.openai/hosting.json`. Reuse it for later deployments.
