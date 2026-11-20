# PTO Bingo Board (Vite + React)

This is a single‑page app for displaying called Bingo numbers on a smartboard during PTO Bingo Night. Built with Vite 5 and React 19.

## Local development

- Dev server: `npm run dev` → open the printed `http://localhost:5173/`
- Build: `npm run build` → outputs `dist/`
- Preview prod build: `npm run preview`
- Lint: `npm run lint`

See `src/index.css` for layout and typography adjustments.

## Deploying to GitHub Pages

`.github/workflows/pages.yml` builds and publishes the static site to GitHub Pages on every push to `main` (or manually via **Run workflow**).

How it works:
- The workflow runs `npm ci` and `npm run build`, then uploads `dist/` as the Pages artifact.
- A `404.html` copy of `index.html` is created so client‑side routing (if added later) works on deep links.
- Vite `base` comes from the `BASE_PATH` the workflow reads from `actions/configure-pages`, so the app works at `https://<user>.github.io/<repo>/` and on a custom domain at `/`.

One-time setup: in the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.

Notes:
- Renaming the repository changes the Pages path; no code changes are needed.
- For a custom domain, configure it in **Settings → Pages**; no app changes required.

## Smartboard checklist (1920×1080)

- Open in fullscreen; verify all five BINGO columns are fully visible without vertical scroll.
- Click numbers to confirm highlighting and "Last Number Called" updates.
- Test Reset flow for accidental clicks.

For architecture notes and the 1920×1080 layout check, see `CLAUDE.md`.
