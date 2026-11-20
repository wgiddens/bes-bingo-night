// src/Board.jsx
import React from 'react';

const sparkleLayout = Array.from({ length: 76 }, () => ({
  shimmerDelay: `${(Math.random() * 9).toFixed(2)}s`,
  glints: Array.from({ length: 2 }, () => ({
    left: `${10 + Math.random() * 80}%`,
    top: `${15 + Math.random() * 70}%`,
    animationDelay: `${(Math.random() * 3.2).toFixed(2)}s`,
  })),
}));

function cellClassName(number, { calledNumbers, incoming, lastCalled, justLanded }) {
  if (incoming.has(number)) return 'number-cell incoming';
  if (!calledNumbers.has(number)) return 'number-cell';
  let className = 'number-cell active';
  if (number === lastCalled) className += ' latest';
  if (number === justLanded) className += ' just-landed';
  return className;
}

function Board({ calledNumbers, incoming, lastCalled, justLanded, toggleNumber, cellRefs }) {
  const state = { calledNumbers, incoming, lastCalled, justLanded };
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
                ref={(el) => {
                  cellRefs.current.set(number, el);
                  return () => cellRefs.current.delete(number);
                }}
                className={cellClassName(number, state)}
                style={{ '--shimmer-delay': sparkleLayout[number].shimmerDelay }}
                onClick={() => toggleNumber(number)}
              >
                <span>{number}</span>
                {sparkleLayout[number].glints.map((glint, i) => (
                  <i key={i} className="glint" style={glint} />
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </main>
  );
}

export default Board;
