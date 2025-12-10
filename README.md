# PTO Bingo Board (Vite + React)

This is a single‑page app for displaying called Bingo numbers on a smartboard during PTO Bingo Night. Built with Vite 5 and React 19.

## Local development

- Dev server: `npm run dev` → open the printed `http://localhost:5173/`
- Build: `npm run build` → outputs `dist/`
- Preview prod build: `npm run preview`
- Lint: `npm run lint`

See `src/index.css` for layout and typography adjustments.

## Deploying to GitLab Pages

This repository includes a `.gitlab-ci.yml` that builds and publishes the static site to GitLab Pages.

How it works:
- On the default branch, the CI job runs `npm ci` and `npm run build`.
- Build output from `dist/` is copied to `public/` for Pages artifacts.
- A `404.html` copy of `index.html` is created so client‑side routing (if added later) works on deep links.
- Vite `base` is set automatically during CI using `CI_PAGES_URL` or `CI_PROJECT_NAME`, so the app works at `https://<user-or-group>.gitlab.io/<project-name>/` and also at root pages `https://<user-or-group>.gitlab.io/` when applicable.

Steps to publish:
1) Push to the default branch (e.g., `main`) on GitLab.
2) Wait for the `pages` job to complete in CI.
3) Visit Settings → Pages in your GitLab project to see the live URL.

Notes:
- If you rename the project, the Pages path changes. No code changes are needed because `vite.config.js` derives the base path from CI variables.
- For custom domains, set up the domain in GitLab Pages settings; no app changes required.

## Smartboard checklist (1920×1080)

- Open in fullscreen; verify all five BINGO columns are fully visible without vertical scroll.
- Click numbers to confirm highlighting and "Last Number Called" updates.
- Test Reset flow for accidental clicks.

For more details, see `.junie/guidelines.md`.
