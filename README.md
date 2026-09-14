# Keeper of Stories

The website for Keeper of Stories, a storytelling robot built by Lisieux Titan from Lisieux English School, Vaikom, Kerala. Keeper recognises Indian folk paintings, explains them and answers questions out loud. It placed 7th at the WRO India 2026 National Championship (Future Innovators, Senior).

Live at https://keeper-of-stories.vercel.app

## Running it locally

```bash
npm start
```

Then open http://127.0.0.1:4173. There are no dependencies: the site is plain HTML, CSS and JavaScript in `dist/`.

`npm run validate` checks image attributes, local file references, anchors and script syntax. Vercel runs the same check as the build step, so a broken reference fails the deploy instead of going live.

## Files

- `dist/index.html` — all page content
- `dist/style.css` — layout and design
- `dist/script.js` — mobile menu, the hero screen cycle, the Ask Keeper demo and scroll reveals
- `dist/assets/art/` — photographs of the five paintings used in the demo
- `scripts/prepare-fonts.mjs` — re-downloads the self-hosted fonts (Bricolage Grotesque and IBM Plex Mono, both OFL; licences in `dist/assets/fonts/`)

## Notes on content

- Documentary photos (Keeper, prototype, Nationals board, booth, team) were supplied by Lisieux Titan.
- The tech stack in "How it works" comes from the team's poster at Nationals.
- The Ask Keeper conversation is scripted, not a live connection to the robot. Answers are short summaries of widely documented facts about each tradition.
- The Tanjore image carries a third-party watermark and should be replaced with a photo the team has rights to.
