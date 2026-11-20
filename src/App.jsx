import { useState, useCallback, useEffect } from 'react'
import './index.css';
import Board from './Board.jsx';
import Modal from './Modal.jsx';
import logo from './assets/logo.png';

const STORAGE_KEY = 'bingo-game';

function loadSavedGame() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) return saved;
  } catch {
    // Corrupt or inaccessible storage: start a fresh game.
  }
  return { calledNumbers: [], lastCalled: null };
}

function App() {
  const [calledNumbers, setCalledNumbers] = useState(() => new Set(loadSavedGame().calledNumbers));
  const [showResetModal, setShowResetModal] = useState(false);
  const [lastCalled, setLastCalled] = useState(() => loadSavedGame().lastCalled);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ calledNumbers: [...calledNumbers], lastCalled }));
  }, [calledNumbers, lastCalled]);

  const toggleNumber = useCallback((number) => {
    setCalledNumbers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(number)) {
        newSet.delete(number);
        // If we uncheck the last called number, we don't easily know the previous one 
        // without a history stack, but for simple bingo, just clearing it if it matches is fine.
        if (lastCalled === number) {
          setLastCalled(null);
        }
      } else {
        newSet.add(number);
        setLastCalled(number);
      }
      return newSet;
    });
  }, [lastCalled]);

  const openResetModal = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setCalledNumbers(new Set());
    setLastCalled(null);
    setShowResetModal(false);
  };

  const cancelReset = () => {
    setShowResetModal(false);
  };

  const getNumberLetter = (n) => {
    if (n <= 15) return 'B';
    if (n <= 30) return 'I';
    if (n <= 45) return 'N';
    if (n <= 60) return 'G';
    return 'O';
  };

  return (
    <div className="app-shell">
      <aside className="left-panel">
        <header className="brand">
          <h1>Brooklet Elementary School</h1>
          <div className="subheading">The BESt Bingo Night</div>
        </header>

        <div className="last-called-container">
          <span className="last-called-label">Last Number Called</span>
          <div className="big-number">
            {lastCalled ? `${getNumberLetter(lastCalled)}\u00A0${lastCalled}` : '--'}
          </div>
        </div>

        <div className="logo-circle">
          <img src={logo} alt="Brooklet Elementary School Yellow Jackets logo" className="logo" />
        </div>

        <div className="controls">
          <button className="reset-btn" onClick={openResetModal}>Reset Board</button>
        </div>
      </aside>

      <section className="right-panel">
        <Board calledNumbers={calledNumbers} toggleNumber={toggleNumber} />
      </section>

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
