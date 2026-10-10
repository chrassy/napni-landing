# Napni — landing page

Marketing page for Napni, the turn-key white-label management platform for gyms.
Plain HTML, CSS and JS, no build step. Slovenian copy.

Live: https://chrassy.github.io/napni-landing/

## Local preview

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Editing

- `index.html` — all copy and sections
- `styles.css` — tokens at the top (`--volt` is Napni's colour, `--club` the demo club's accent)
- `script.js` — reveal animations, the white-label tuner, go-live checklist; `CONTACT_EMAIL` at the top sets every contact link
- `og.png` — social preview image (1200×630)

Pushing to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`).
