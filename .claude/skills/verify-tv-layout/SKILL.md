---
name: verify-tv-layout
description: Check the bingo board layout on the TV target (1920×1080 fullscreen) after any change to src/index.css, App.jsx, or Board.jsx markup. Confirms no scrolling and all 75 numbers visible.
---

# Verify the TV layout

Only check 1920×1080. Do not test other resolutions unless asked.

1. Start the dev server (`npm run dev`) and open http://localhost:5173/ in a browser.
2. Set the viewport to 1920×1080.
3. Run this in the page:

```js
(() => {
  const de = document.documentElement, body = document.body;
  const board = document.querySelector('.bingo-board');
  const right = document.querySelector('.right-panel');
  const counts = board ? Array.from(board.children).map(c => c.children.length) : [];
  return {
    hasScrollbar: de.scrollHeight > de.clientHeight || body.scrollHeight > body.clientHeight,
    right: right && { clientH: right.clientHeight, scrollH: right.scrollHeight },
    board: board && { clientH: board.clientHeight, scrollH: board.scrollHeight },
    allColumnsHave16: counts.length === 5 && counts.every(n => n === 16),
  };
})()
```

Pass when:
- `hasScrollbar` is `false`.
- `clientH === scrollH` for both `right` and `board`.
- `allColumnsHave16` is `true` (one header plus 15 cells per column).

4. Click a few numbers and confirm they highlight and "Last Number Called" updates. Open Reset, cancel it, then confirm it and check the board clears.

If a check fails, fix it in `src/index.css` and keep the two-panel, no-scroll layout.
