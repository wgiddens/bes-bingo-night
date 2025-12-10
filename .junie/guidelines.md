### PTO Bingo Board – Development Guidelines

These notes capture project-specific knowledge for operating, developing, and testing the Bingo Board shown on a smartboard during PTO Bingo Night. The app is a Vite + React single-page app (SPA) optimized for a fullscreen display of called bingo numbers.

#### Build and configuration

- Runtime stack
  - Tooling: Vite 5 (see `vite.config.js`), React 19, ESLint (flat config) with React Hooks and React Refresh rules.
  - Node: Prefer Node 20.19+ or 22.12+. Older 20.x may still work but can emit engine warnings from transient tools (e.g., Vitest). The app itself is built and served by Vite 5 in this repo.

- Commands (package.json)
  - Dev server: `npm run dev` → starts Vite with HMR on a local port (shown in terminal). Open the printed URL.
  - Production build: `npm run build` → outputs `dist/`.
  - Local preview of the prod build: `npm run preview` → serves from `dist/` to validate on the target display.
  - Lint: `npm run lint`.

- Smartboard/Display setup tips
  - Use the browser’s fullscreen mode on the smartboard device (Mac: green window button or `Ctrl+Cmd+F`; Windows: `F11`).
  - Ensure OS/browser zoom is set so all five B-I-N-G-O columns comfortably fit with adequate line height; the styling resides in `src/index.css`.
  - Disable sleep/screen savers on the host device for the event duration.
  - If you rebuild and redeploy in place, clear cache or add a cache-busting query on reload to avoid stale assets.

#### Testing information

This repo does not include a persistent test framework by design. 

You can use the playwright action to open the app in a browser. The app is available at http://localhost:5173/.

#### Additional development information

- Source layout
  - Entry: `index.html` loads `src/main.jsx` which mounts `<App />` into `#root`.
  - Styling: `src/index.css` contains all page visuals including the 5 bingo columns and modal styling. Adjust typography and spacing here for different displays.
  - Components:
    - `src/App.jsx`: Orchestrates state for called numbers, last-called display, and the reset modal.
      - `calledNumbers` is a `Set<number>` tracking toggled numbers 1–75.
      - `lastCalled` reflects the most recently toggled-on number; if a number is untoggled and equals the last called, it’s cleared (history stack intentionally not maintained for simplicity during live events).
    - `src/Board.jsx`: Renders five columns labeled B/I/N/G/O and numbers 1–75 (15 per column). Applies an `active` class to numbers present in `calledNumbers`; clicking a cell invokes `toggleNumber(number)`.
    - `src/Modal.jsx`: Basic confirm/cancel modal used for resetting the board. Clicking the overlay cancels; clicks inside the modal are stopped from propagating.

- Code style and conventions
  - React 19 function components with hooks; avoid adding class components.
  - Keep logic in `App.jsx` minimal and event-friendly; heavy features should remain opt-in so event operators are not distracted.
  - Avoid global state managers for this app’s size. Prefer local state and straightforward props (`calledNumbers`, `toggleNumber`).
  - If adding persistence (e.g., `localStorage`) for called numbers, ensure a clear “Reset Board” UX remains and persistence is opt-in.
  - Accessibility: Large contrast and hit targets matter for visibility and quick operation. When modifying CSS, preserve readable color contrast and adequate spacing.

- Deployment and operations
  - For ad-hoc local events, `npm run preview` on the machine connected to the smartboard is usually sufficient.
  - For hosted deployments, serve `dist/` as static content behind any simple static host or CDN. The app has no server-side requirements.

#### What to watch out for

- Node engine warnings during tooling installs are often from transient packages used in ad-hoc tests (e.g., different Vitest versions can depend on newer Vite). They do not affect `npm run dev` or `npm run build` in this repo, which use Vite 5 per `devDependencies`.
- If adding a permanent test stack, pin versions compatible with Vite 5 or plan a controlled upgrade to Vite 6/7 and React testing libraries.
- Smartboard resolution differences can shift layout; validate on the target device using `npm run preview` and adjust `src/index.css` accordingly.

#### Quick checklist before an event

- [ ] Open in fullscreen and verify all five columns are visible and readable from the back of the room.
- [ ] Click a few numbers to confirm the highlight and “Last Number Called” updates (e.g., B 7, I 20).
- [ ] Test the Reset flow and ensure accidental clicks are easy to undo.
- [ ] Disable sleep/screensaver on the host device.

---

### Junie Runbook: Visual verification at 1920×1080 (required)

For layout validation, only check the fullscreen smartboard scenario at 1920×1080. Use the built‑in Playwright tools as follows:

1) Navigate to the local dev server
   - `mcp_playwright_browser_navigate` → `http://localhost:5173/`

2) Set the viewport to 1920×1080
   - `mcp_playwright_browser_resize` → `{ width: 1920, height: 1080 }`

3) Verify there is no vertical scrolling and the board fills the right panel
   - Call `mcp_playwright_browser_evaluate` with the function below. Expect `hasScrollbar: false`, and both `.right-panel` and `.bingo-board` to have equal `clientHeight` and `scrollHeight`.

```js
() => {
  const de = document.documentElement;
  const body = document.body;
  const board = document.querySelector('.bingo-board');
  const right = document.querySelector('.right-panel');
  const cols = board ? Array.from(board.children) : [];
  const counts = cols.map((c) => c.children.length);
  return {
    viewport: { w: window.innerWidth, h: window.innerHeight },
    hasScrollbar: de.scrollHeight > de.clientHeight || body.scrollHeight > body.clientHeight,
    right: right ? { clientH: right.clientHeight, scrollH: right.scrollHeight } : null,
    board: board ? { clientH: board.clientHeight, scrollH: board.scrollHeight } : null,
    columns: counts.length,
    perColumnChildren: counts,
    allColumnsHave16: counts.length === 5 && counts.every(n => n === 16),
  };
}
```

Pass criteria at 1920×1080
- `hasScrollbar` is `false`.
- `.right-panel.clientH === .right-panel.scrollH`.
- `.bingo-board.clientH === .bingo-board.scrollH`.
- `columns === 5` and `allColumnsHave16 === true` (1 header + 15 number cells per column).

Notes
- Do not check other resolutions unless explicitly asked. The authoritative verification target is 1920×1080.
- If any check fails, adjust `src/index.css` but keep the two‑column, no‑scroll contract.