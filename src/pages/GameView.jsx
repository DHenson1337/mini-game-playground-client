import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router";
import { getUserFromSession } from "../utils/userSession";
import TetrisGame from "../components/games/TetrisGame";
import { apiService } from "../utils/apiService";
import "./styles/GameView.css";

const GameView = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const userData = getUserFromSession();

  // Get user data and add debug logging
  console.log("GameView - Current user data:", userData);

  useEffect(() => {
    //Check for user Data
    if (!userData) {
      console.log("No user data found, redirecting to landing page");
      navigate("/");
      return;
    }

    const fetchGame = async () => {
      try {
        setIsLoading(true);
        const gameData = await apiService.fetchGame(gameId);
        setGame(gameData);
        setError(null);
      } catch (error) {
        console.error("Error fetching game:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGame();
  }, [gameId, navigate, userData]);

  const handleScoreSubmit = useCallback(
    async (score) => {
      if (!userData || !gameId) {
        console.error("Missing user data or game ID");
        return;
      }

      try {
        console.log("Submitting score with data:", {
          username: userData.username,
          gameId,
          score,
        });

        const response = await apiService.submitScore({
          username: userData.username,
          gameId,
          score,
        });

        console.log("Score submission response:", response);
        return response; // Return the response so TetrisGame can update its state
      } catch (error) {
        console.error("Score submission error:", error);
        throw error; // Rethrow so TetrisGame can handle the error
      }
    },
    [userData, gameId]
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
      </div>
    </div>
  );
};

export default GameView;
