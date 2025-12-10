// src/Board.jsx
import React from 'react';

function Board({ calledNumbers, toggleNumber }) {
  const getNumberLetter = (n) => {
    if (n <= 15) return 'B';
    if (n <= 30) return 'I';
    if (n <= 45) return 'N';
    if (n <= 60) return 'G';
    return 'O';
  };

  return (
    <main className="bingo-board">
      {['B', 'I', 'N', 'G', 'O'].map((letter, colIndex) => {
        const start = colIndex * 15 + 1;
        const numbers = Array.from({ length: 15 }, (_, i) => start + i);
        return (
          <div key={letter} className="column">
            <div className="column-header">{letter}</div>
            {numbers.map((number) => (
              <div
                key={number}
                className={`number-cell ${calledNumbers.has(number) ? 'active' : ''}`}
                onClick={() => toggleNumber(number)}
              >
                {number}
              </div>
            ))}
          </div>
        );
      })}
    </main>
  );
}

export default Board;
