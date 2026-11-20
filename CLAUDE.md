# BES Bingo Board

Bingo caller board for Brooklet Elementary's PTO Bingo Night. An operator clicks numbers as they're called, and the board shows fullscreen on a big TV.

## Display target

- The TV at 1920×1080 fullscreen is the only display that matters. Don't add mobile or responsive breakpoints.
- Optimize for readability from the back of a room: large text, high contrast, no scrolling.
- After any layout or CSS change, run the `verify-tv-layout` skill.

## Commands

- `npm run dev` for the dev server at http://localhost:5173/
- `npm run lint`; there is no test suite, by design.
- `npm run preview` serves the production build on the machine driving the TV.

## Behavior to preserve

- Unchecking the number shown as "Last Number Called" resets it to `--`. There's intentionally no call history.
- State is in memory only, so a reload clears the board. If persistence is ever added, make it opt-in and keep Reset obvious.
- Keep the operator UI minimal so nothing distracts during a live event.

## Deployment

Pushing to `main` deploys to GitHub Pages (`.github/workflows/pages.yml`).
