import React, { useState, useEffect, useCallback } from "react";
import "./SnakeGame.css";

const SnakeGame = ({ onScoreUpdate }) => {
  const [gridSize, setGridSize] = useState(20);
  const [gameSpeed, setGameSpeed] = useState(200);
  const [snake, setSnake] = useState([[10, 10]]);
  const [direction, setDirection] = useState([0, -1]);
  const [food, setFood] = useState([5, 5]);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [edgeWrapping, setEdgeWrapping] = useState(true);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);

  const resetGame = () => {
    setSnake([[10, 10]]);
    setDirection([0, -1]);
    setFood([
      Math.floor(Math.random() * gridSize),
      Math.floor(Math.random() * gridSize),
    ]);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setScoreSubmitted(false);
  };

  const handleKeyDown = useCallback(
    (e) => {
      e.preventDefault();

      if (isPaused && e.key !== " ") return;

      const oppositeDirections = {
        ArrowLeft: [0, 1], // Right
        ArrowRight: [0, -1], // Left
        ArrowUp: [1, 0], // Down
        ArrowDown: [-1, 0], // Up
      };

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowRight":
        case "ArrowUp":
        case "ArrowDown":
          const newDir = {
            ArrowLeft: [0, -1],
            ArrowRight: [0, 1],
            ArrowUp: [-1, 0],
            ArrowDown: [1, 0],
          }[e.key];

          // Prevent moving in opposite direction
          if (
            direction[0] !== oppositeDirections[e.key][0] ||
            direction[1] !== oppositeDirections[e.key][1]
          ) {
            setDirection(newDir);
          }
          break;
        case " ":
          setIsPaused((prev) => !prev);
          break;
        default:
          break;
      }
    },
    [isPaused, direction]
  );

  const moveSnake = useCallback(() => {
    if (isPaused || gameOver) return;

    setSnake((prevSnake) => {
      const newHead = [
        prevSnake[0][0] + direction[0],
        prevSnake[0][1] + direction[1],
      ];

      if (edgeWrapping) {
        newHead[0] = (newHead[0] + gridSize) % gridSize;
        newHead[1] = (newHead[1] + gridSize) % gridSize;
      } else if (
        newHead[0] < 0 ||
        newHead[1] < 0 ||
        newHead[0] >= gridSize ||
        newHead[1] >= gridSize
      ) {
        setGameOver(true);
        return prevSnake;
      }

      // Check collision with self
      if (prevSnake.some(([x, y]) => x === newHead[0] && y === newHead[1])) {
        setGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead[0] === food[0] && newHead[1] === food[1]) {
        setScore((prevScore) => prevScore + 10);
        setFood([
          Math.floor(Math.random() * gridSize),
          Math.floor(Math.random() * gridSize),
        ]);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gridSize, edgeWrapping, isPaused, gameOver]);

  useEffect(() => {
    const interval = setInterval(moveSnake, gameSpeed);
    return () => clearInterval(interval);
  }, [moveSnake, gameSpeed]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleScoreSubmit = async () => {
    if (scoreSubmitted) return;

    try {
      await onScoreUpdate(score);
      setScoreSubmitted(true);
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  };

  return (
    <div className="snake-container">
      <div className="snake-info">
        <div>Score: {score}</div>
        <div>Grid Size: {gridSize}</div>
        <div>Speed: {gameSpeed}ms</div>
      </div>

      <div
        className="snake-board"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
          const x = Math.floor(idx / gridSize);
          const y = idx % gridSize;
          const isSnake = snake.some(([sx, sy]) => sx === x && sy === y);
          const isFood = food[0] === x && food[1] === y;
          return (
            <div
              key={idx}
              className={`snake-cell ${isSnake ? "snake-body" : ""} ${
                isFood ? "snake-food" : ""
              }`}
            ></div>
          );
        })}
      </div>

      {gameOver && (
        <div className="snake-game-over">
          <div>Game Over!</div>
          <div className="snake-final-score">Final Score: {score}</div>
          <div className="snake-buttons">
            <button onClick={resetGame}>Play Again</button>
            <button
              onClick={handleScoreSubmit}
              disabled={scoreSubmitted}
              className={scoreSubmitted ? "score-submitted" : ""}
            >
              {scoreSubmitted ? "Score Submitted!" : "Submit Score"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
