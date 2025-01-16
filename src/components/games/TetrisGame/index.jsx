import React, { useState, useEffect } from "react";
import Tetris from "react-tetris";
import "./styles.css";

const TetrisGame = ({ onScoreUpdate }) => {
  const [gameState, setGameState] = useState("ready"); // ready, playing, paused, ended
  const [currentScore, setCurrentScore] = useState(0);

  // Handle game state changes
  useEffect(() => {
    // Prevent arrow keys from scrolling the page
    const preventArrowScroll = (e) => {
      if (
        [" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", preventArrowScroll);
    return () => window.removeEventListener("keydown", preventArrowScroll);
  }, []);

  // Submit score when game ends
  const handleGameEnd = async (points) => {
    setGameState("ended");
    setCurrentScore(points);
    if (onScoreUpdate) {
      try {
        await onScoreUpdate(points);
        console.log("Score submitted successfully:", points);
      } catch (error) {
        console.error("Failed to submit score:", error);
      }
    }
  };

  return (
    <div className="tetris-container">
      <div className="game-header">
        <h2>Tetris</h2>
        {gameState === "paused" && (
          <div className="pause-overlay">Game Paused</div>
        )}
      </div>

      <Tetris
        keyboardControls={{
          down: "MOVE_DOWN",
          left: "MOVE_LEFT",
          right: "MOVE_RIGHT",
          space: "HARD_DROP",
          z: "FLIP_COUNTERCLOCKWISE",
          x: "FLIP_CLOCKWISE",
          up: "FLIP_CLOCKWISE",
          p: "TOGGLE_PAUSE",
          c: "HOLD",
          shift: "HOLD",
        }}
      >
        {({
          HeldPiece,
          Gameboard,
          PieceQueue,
          points,
          linesCleared,
          state,
          controller,
        }) => (
          <div className="tetris-game">
            {/* Left Panel */}
            <div className="game-panel left-panel">
              <div className="held-piece-container">
                <h3>Held Piece</h3>
                <div className="held-piece">
                  <HeldPiece />
                </div>
              </div>
              <div className="game-stats">
                <div className="stat-item">
                  <span>Score</span>
                  <span>{points}</span>
                </div>
                <div className="stat-item">
                  <span>Lines</span>
                  <span>{linesCleared}</span>
                </div>
              </div>
            </div>

            {/* Main Game Board */}
            <div className="game-board-container">
              <Gameboard />
              {state === "LOST" && (
                <div className="game-over-overlay">
                  <div className="game-over-content">
                    <h3>Game Over!</h3>
                    <p>Final Score: {points}</p>
                    <button
                      onClick={() => {
                        handleGameEnd(points);
                        controller.restart();
                        setGameState("playing");
                      }}
                      className="play-again-btn"
                    >
                      Play Again
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel */}
            <div className="game-panel right-panel">
              <div className="next-piece-container">
                <h3>Next Piece</h3>
                <div className="piece-queue">
                  <PieceQueue />
                </div>
              </div>
              <div className="controls-guide">
                <h3>Controls</h3>
                <ul>
                  <li>← → : Move</li>
                  <li>↑ : Rotate Right</li>
                  <li>Z : Rotate Left</li>
                  <li>↓ : Soft Drop</li>
                  <li>Space : Hard Drop</li>
                  <li>C/Shift : Hold</li>
                  <li>P : Pause</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Tetris>
    </div>
  );
};

export default TetrisGame;
