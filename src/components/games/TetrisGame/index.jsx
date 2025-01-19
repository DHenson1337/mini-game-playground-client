import React, { useState, useEffect, useCallback } from "react";
import Tetris from "react-tetris";
import useSound from "use-sound";
import { useSoundSystem } from "../../../context/SoundContext";
import "./styles.css";

const TetrisGame = ({ onScoreUpdate }) => {
  const [gameState, setGameState] = useState("ready");
  const [currentScore, setCurrentScore] = useState(0);
  const [isScoreSubmitted, setIsScoreSubmitted] = useState(false);
  const { isMuted, volume } = useSoundSystem();

  // Sound effects setup with volume control
  const [playRotate] = useSound("/assets/sounds/tetris/rotate.wav", {
    volume: volume * 0.5,
    disabled: isMuted,
  });
  const [playMove] = useSound("/assets/sounds/tetris/move.wav", {
    volume: volume * 0.3,
    disabled: isMuted,
  });
  const [playLineClear] = useSound("/assets/sounds/tetris/line-clear.wav", {
    volume: volume * 0.6,
    disabled: isMuted,
  });
  const [playHardDrop] = useSound("/assets/sounds/tetris/hard-drop.wav", {
    volume: volume * 0.4,
    disabled: isMuted,
  });
  const [playGameOver] = useSound("/assets/sounds/tetris/game-over.wav", {
    volume: volume * 0.7,
    disabled: isMuted,
  });

  useEffect(() => {
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

  // Handle score submission
  const handleScoreSubmit = useCallback(
    async (points) => {
      if (isScoreSubmitted) return;

      try {
        await onScoreUpdate(points);
        setIsScoreSubmitted(true);
      } catch (error) {
        console.error("Failed to submit score:", error);
      }
    },
    [onScoreUpdate, isScoreSubmitted]
  );

  // Sound effect handlers
  const handlePieceMove = useCallback(() => {
    playMove();
  }, [playMove]);

  const handlePieceRotate = useCallback(() => {
    playRotate();
  }, [playRotate]);

  const handleLineClear = useCallback(() => {
    playLineClear();
  }, [playLineClear]);

  const handleHardDrop = useCallback(() => {
    playHardDrop();
  }, [playHardDrop]);

  // Update game state and handle game over
  const handleGameStateChange = useCallback(
    (state, points) => {
      setGameState(state);
      if (state === "LOST") {
        setCurrentScore(points);
        playGameOver();
      }
    },
    [playGameOver]
  );

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
          onAction,
        }) => {
          // Update game state when it changes
          useEffect(() => {
            handleGameStateChange(state, points);
          }, [state, points]);

          // Handle game actions and trigger sound effects
          useEffect(() => {
            const actionHandler = (action) => {
              switch (action) {
                case "MOVE_LEFT":
                case "MOVE_RIGHT":
                case "MOVE_DOWN":
                  handlePieceMove();
                  break;
                case "FLIP_CLOCKWISE":
                case "FLIP_COUNTERCLOCKWISE":
                  handlePieceRotate();
                  break;
                case "HARD_DROP":
                  handleHardDrop();
                  break;
                case "LINE_CLEAR":
                  handleLineClear();
                  break;
                default:
                  break;
              }
            };

            if (onAction) {
              onAction(actionHandler);
            }

            return () => {
              if (onAction) {
                onAction(null);
              }
            };
          }, [
            handlePieceMove,
            handlePieceRotate,
            handleHardDrop,
            handleLineClear,
          ]);

          return (
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
                      <div className="game-over-buttons">
                        {!isScoreSubmitted && (
                          <button
                            onClick={() => handleScoreSubmit(points)}
                            className="submit-score-btn"
                            disabled={isScoreSubmitted}
                          >
                            {isScoreSubmitted
                              ? "Score Submitted!"
                              : "Submit Score"}
                          </button>
                        )}
                        <button
                          onClick={() => {
                            controller.restart();
                            setGameState("playing");
                            setIsScoreSubmitted(false);
                          }}
                          className="play-again-btn"
                        >
                          Play Again
                        </button>
                      </div>
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
          );
        }}
      </Tetris>
    </div>
  );
};

export default TetrisGame;
