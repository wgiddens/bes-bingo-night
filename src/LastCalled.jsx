import { useEffect, useState } from 'react';

const MAX_FONT_SIZE = 210;
const FONT = 'Fredoka';
const LETTER_GAP_EM = 0.32;

function getNumberLetter(n) {
  if (n <= 15) return 'B';
  if (n <= 30) return 'I';
  if (n <= 45) return 'N';
  if (n <= 60) return 'G';
  return 'O';
}

function widestCallWidth(fontSize) {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.font = `700 ${fontSize}px ${FONT}`;
  let widest = 0;
  for (let n = 1; n <= 75; n++) {
    const width = ctx.measureText(getNumberLetter(n)).width + ctx.measureText(String(n)).width + fontSize * LETTER_GAP_EM;
    widest = Math.max(widest, width);
  }
  return widest;
}

function LastCalled({ lastCalled, callId, boxRef, digitsRef }) {
  const [fontSize, setFontSize] = useState(MAX_FONT_SIZE);

  useEffect(() => {
    // One size for every call, based on the widest one, so the number never overflows or jumps in size.
    function fit() {
      const box = boxRef.current;
      const style = getComputedStyle(box);
      const available = box.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - 24;
      setFontSize(Math.min(MAX_FONT_SIZE, Math.floor((MAX_FONT_SIZE * available) / widestCallWidth(MAX_FONT_SIZE))));
    }
    document.fonts.load(`700 ${MAX_FONT_SIZE}px ${FONT}`).then(fit);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [boxRef]);

  return (
    <div className="last-called-container" ref={boxRef}>
      <span className="last-called-label">Last Number Called</span>
      {lastCalled ? (
        <div key={callId} className={`big-number${callId ? ' pop' : ''}`} style={{ fontSize }}>
          <span className="letter" style={{ marginRight: `${LETTER_GAP_EM}em` }}>{getNumberLetter(lastCalled)}</span>
          <span className="digits" ref={digitsRef}>{lastCalled}</span>
        </div>
      ) : (
        <div className="big-number empty" style={{ fontSize }}>--</div>
      )}
      {callId > 0 && <div key={`flash-${callId}`} className="last-called-flash" />}
    </div>
  );
}

export default LastCalled;
