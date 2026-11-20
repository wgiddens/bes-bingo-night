// src/Board.jsx
import React from 'react';

function Board({ calledNumbers, toggleNumber }) {
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
