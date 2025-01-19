import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { useUser } from "../context/UserContext";
import TetrisGame from "../components/games/TetrisGame";
import TicTacToe from "../components/games/TicTacToe";
import { apiService } from "../utils/apiService";
import "./styles/GameView.css";

const GameView = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { user } = useUser(); // Use the auth context instead of localStorage
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch game data
  useEffect(() => {
    if (!user) {
      console.log("No user data, redirecting to landing page");
      navigate("/");
      return;
    }

    let isSubscribed = true;

    const fetchGame = async () => {
      try {
        setIsLoading(true);
        const gameData = await apiService.fetchGame(gameId);
        if (isSubscribed) {
          setGame(gameData);
          setError(null);
        }
      } catch (err) {
        if (isSubscribed) {
          console.error("Error fetching game:", err);
          setError(err.message);
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    fetchGame();

    return () => {
      isSubscribed = false;
    };
  }, [gameId, navigate, user]);

  // Memoize the score submission handler
  const handleScoreSubmit = useCallback(
    async (score) => {
      if (!user?.username || !gameId) {
        console.error("Missing user data or game ID");
        return;
      }

      try {
        console.log("Submitting score:", {
          username: user.username,
          gameId,
          score,
        });

        const response = await apiService.submitScore({
          username: user.username,
          gameId,
          score,
        });

        console.log("Score submission successful:", response);
        return response;
      } catch (error) {
        console.error("Score submission error:", error);
        throw error;
      }
    },
    [user?.username, gameId]
  );

  const handleReturnToGames = useCallback(() => {
    navigate("/games");
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="game-loading">
        <div className="loading-spinner"></div>
        <p>Loading game...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-error">
        <h2>Game Not Available</h2>
        <p>{error}</p>
        <button onClick={handleReturnToGames} className="return-button">
          Return to Games
        </button>
      </div>
    );
  }

  return (
    <div className="game-view">
      <div className="game-header">
        <h1>{game?.title || "Game"}</h1>
        <button onClick={handleReturnToGames} className="return-button">
          ← Back to Games
        </button>
      </div>
      <div className="game-container">
        {gameId === "tetris-classic" && (
          <TetrisGame onScoreUpdate={handleScoreSubmit} />
        )}
        {gameId === "tic-tac-toe" && (
          <TicTacToe onScoreUpdate={handleScoreSubmit} />
        )}
      </div>
    </div>
  );
};

export default GameView;
