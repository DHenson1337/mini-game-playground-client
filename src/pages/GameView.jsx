import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { getUserFromSession } from "../utils/userSession";
import API_URLS from "../utils/apiUrls";
import "./styles/GameView.css";

const GameView = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState("start");
  const [gameResult, setGameResult] = useState(null);
  const gameInstanceRef = useRef(null);
  const userData = getUserFromSession();

  useEffect(() => {
    if (!userData) {
      navigate("/");
      return;
    }

    // Handle game end
    const handleGameEnd = (event) => {
      const { score, won } = event.detail;
      setGameResult({ score, won });
      setGameState("end");
    };

    const initGame = async () => {
      try {
        // Load Phaser
        if (!window.Phaser) {
          await loadScript(
            "https://cdn.jsdelivr.net/npm/phaser@3.87.0/dist/phaser.min.js"
          );
        }

        // Load game script
        if (!window.AppleCatcherGame) {
          await loadScript("/games/apple-catcher/game.js");
        }

        // Initialize game
        if (!gameInstanceRef.current) {
          gameInstanceRef.current = new window.AppleCatcherGame({
            onScoreSubmit: handleScoreSubmit,
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load game:", error);
      }
    };

    document.addEventListener("gameEnd", handleGameEnd);
    initGame();

    // Cleanup
    return () => {
      document.removeEventListener("gameEnd", handleGameEnd);
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy();
        gameInstanceRef.current = null;
      }
    };
  }, [navigate, userData]);

  const handleStartGame = () => {
    setGameState("playing");
    if (gameInstanceRef.current?.game) {
      // Get the scene
      const scene = gameInstanceRef.current.game.scene.getScene("scene-game");
      if (scene) {
        // First start background music
        if (scene.bgMusic) {
          scene.bgMusic.play();
        }

        // Resume the scene
        if (scene.scene.isPaused("scene-game")) {
          scene.scene.resume("scene-game");
        } else {
          scene.scene.start("scene-game");
        }
      } else {
        console.error("Scene not found");
      }
    } else {
      console.error("Game instance not found");
    }
  };

  const handleScoreSubmit = async (score) => {
    try {
      await fetch(API_URLS.SCORES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userData.username,
          gameId: "apple-catcher",
          score,
        }),
      });
    } catch (error) {
      console.error("Failed to submit score:", error);
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const handleReturnToGames = () => {
    if (gameInstanceRef.current?.game) {
      gameInstanceRef.current.game.sound.stopAll();
      gameInstanceRef.current.destroy();
      gameInstanceRef.current = null;
    }
    navigate("/games");
  };

  if (isLoading) {
    return (
      <div className="game-loading">
        <div className="loading-spinner"></div>
        <p>Loading game...</p>
      </div>
    );
  }

  return (
    <div className="game-view">
      <div className="game-container">
        <div id="gameCanvas"></div>

        {gameState === "start" && (
          <div className="game-overlay game-start">
            <div className="game-menu">
              <h1>Apple Catcher</h1>
              <p>🍏 You have 45 seconds to catch the Apples!</p>
              <p>Use WASD or Arrow Keys to move</p>
              <p>Catch more than 30 apples to win</p>
              <p>Watch out for rotten apples!</p>
              <button onClick={handleStartGame} className="game-button">
                Start Game
              </button>
            </div>
          </div>
        )}

        {gameState === "end" && gameResult && (
          <div className="game-overlay game-end">
            <div className="game-menu">
              <h2>Game Over!</h2>
              <p className="result-text">
                {gameResult.won ? "You Win! 🎉" : "You Lose 😢"}
              </p>
              <p className="score-text">Score: {gameResult.score}</p>
              <button onClick={handleReturnToGames} className="game-button">
                Return to Games
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameView;
