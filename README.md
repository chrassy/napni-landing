# GymRhythm — landing page

Marketing page for GymRhythm, the turn-key white-label management platform for gyms.
Plain HTML, CSS and JS, no build step. Slovenian copy.

Live: https://gymrhythmapp.com/

## Local preview

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>. The sign-up form posts to the app at
`http://app.localhost:3000` (`npm run dev` in the `napni` repo, with
`SIGNUP_ORIGINS=http://localhost:4173` in its `.env.local`); the confirmation
email lands in Mailpit at <http://localhost:8025>.

## Editing

- `index.html` — all copy and sections
- `styles.css` — tokens at the top (`--volt` is GymRhythm's colour, `--club` the demo club's accent)
- `script.js` — reveal animations, the white-label tuner, go-live checklist; `CONTACT_EMAIL` at the top sets every contact link; `SIGNUP_API` is where the sign-up form (`#registracija`) posts — the app's `app.gymrhythmapp.com`, which must list this page's origin in `SIGNUP_ORIGINS`
- `zasebnost.html` — privacy policy (Slovenian); the highlighted `[…]` placeholders must be filled in before it goes live
- `og.png` — social preview image (1200×630)

Pushing to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`).
