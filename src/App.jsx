import { useState, useEffect, useRef } from 'react'
import './index.css';
import Board from './Board.jsx';
import Modal from './Modal.jsx';
import Castle from './Castle.jsx';
import LastCalled from './LastCalled.jsx';
import { createMagicEffects } from './magicEffects.js';

const STORAGE_KEY = 'bingo-game';
const JUST_LANDED_MS = 1100;

function loadSavedGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) return saved;
  } catch {
    // Corrupt or inaccessible storage: start a fresh game.
  }
  return { calledNumbers: [], lastCalled: null };
}

function without(set, value) {
  const next = new Set(set);
  next.delete(value);
  return next;
}

function App() {
  const [calledNumbers, setCalledNumbers] = useState(() => new Set(loadSavedGame().calledNumbers));
  const [showResetModal, setShowResetModal] = useState(false);
  const [lastCalled, setLastCalled] = useState(() => loadSavedGame().lastCalled);
  const [incoming, setIncoming] = useState(() => new Set());
  const [justLanded, setJustLanded] = useState(null);
  const [latestCall, setLatestCall] = useState(null);

  const skyCanvasRef = useRef(null);
  const fxCanvasRef = useRef(null);
  const leftPanelRef = useRef(null);
  const castleRef = useRef(null);
  const lastCalledBoxRef = useRef(null);
  const digitsRef = useRef(null);
  const cellRefs = useRef(new Map());
  const effectsRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ calledNumbers: [...calledNumbers], lastCalled }));
  }, [calledNumbers, lastCalled]);

  useEffect(() => {
    const effects = createMagicEffects({
      skyCanvas: skyCanvasRef.current,
      fxCanvas: fxCanvasRef.current,
      castle: castleRef.current,
      leftPanel: leftPanelRef.current,
    });
    effectsRef.current = effects;
    return () => effects.destroy();
  }, []);

  useEffect(() => {
    if (!latestCall) return;
    const { number } = latestCall;
    const effects = effectsRef.current;
    const box = lastCalledBoxRef.current;
    const big = digitsRef.current.parentElement;
    const digits = digitsRef.current;
    const boxRect = box.getBoundingClientRect();
    // Layout offsets rather than getBoundingClientRect, because the number is mid scale-in animation.
    const from = {
      x: boxRect.left + box.clientLeft + big.offsetLeft + digits.offsetLeft + digits.offsetWidth / 2,
      y: boxRect.top + box.clientTop + big.offsetTop + big.offsetHeight / 2,
    };
    const cell = cellRefs.current.get(number);

    effects.sprinkle(boxRect);
    effects.launchComet(number, from, cell.getBoundingClientRect(), () => {
      setIncoming(prev => without(prev, number));
      setJustLanded(number);
      setTimeout(() => setJustLanded(current => (current === number ? null : current)), JUST_LANDED_MS);
      effects.burst(cell.getBoundingClientRect());
      effects.celebrate();
    });
  }, [latestCall]);

  const toggleNumber = (number) => {
    if (calledNumbers.has(number)) {
      setCalledNumbers(without(calledNumbers, number));
      setIncoming(prev => without(prev, number));
      effectsRef.current.cancelComet(number);
      if (lastCalled === number) {
        setLastCalled(null);
      }
      return;
    }
    setCalledNumbers(new Set(calledNumbers).add(number));
    setLastCalled(number);
    setIncoming(prev => new Set(prev).add(number));
    setLatestCall({ number, id: (latestCall?.id ?? 0) + 1 });
  };

  const openResetModal = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    effectsRef.current.cancelAllComets();
    setCalledNumbers(new Set());
    setLastCalled(null);
    setIncoming(new Set());
    setJustLanded(null);
    setShowResetModal(false);
  };

  const cancelReset = () => {
    setShowResetModal(false);
  };

  return (
    <div className="app-shell">
      <canvas ref={skyCanvasRef} className="sky-canvas" />

      <aside className="left-panel" ref={leftPanelRef}>
        <header className="brand">
          <h1>Brooklet Elementary School</h1>
          <div className="subheading">The BESt Bingo Night</div>
        </header>

        <LastCalled
          lastCalled={lastCalled}
          callId={latestCall?.id ?? 0}
          boxRef={lastCalledBoxRef}
          digitsRef={digitsRef}
        />

        <Castle ref={castleRef} />

        <div className="controls">
          <button className="reset-btn" onClick={openResetModal}>Reset Board</button>
        </div>
      </aside>

      <section className="right-panel">
        <Board
          calledNumbers={calledNumbers}
          incoming={incoming}
          lastCalled={lastCalled}
          justLanded={justLanded}
          toggleNumber={toggleNumber}
          cellRefs={cellRefs}
        />
      </section>

      <canvas ref={fxCanvasRef} className="fx-canvas" />

      <Modal
        isOpen={showResetModal}
        title="Confirm Reset"
        message="Are you sure you want to reset the board?"
        onConfirm={confirmReset}
        onCancel={cancelReset}
      />
    </div>
  )
}

export default App
