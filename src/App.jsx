import { useState, useCallback } from 'react'
import './index.css';
import Board from './Board.jsx';
import Modal from './Modal.jsx';
import logo from './assets/logo.png';

function App() {
  const [calledNumbers, setCalledNumbers] = useState(new Set());
  const [showResetModal, setShowResetModal] = useState(false);
  const [lastCalled, setLastCalled] = useState(null);

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
            {lastCalled ? `${getNumberLetter(lastCalled)} ${lastCalled}` : '--'}
          </div>
        </div>

        <img src={logo} alt="Brooklet Elementary School Yellow Jackets logo" className="logo" />

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
