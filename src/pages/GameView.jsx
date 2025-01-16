import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router"; // Updated import
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

  const handleReturnToGames = useCallback(() => {
    navigate("/games");
  }, [navigate]);

  useEffect(() => {
    if (!userData) {
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
      } catch (error) {
        if (isSubscribed) {
          console.error("Error fetching game:", error);
          setError(error.message);
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
  }, [gameId, navigate, userData]);

  const handleScoreSubmit = async (score) => {
    if (!userData || !gameId) return;

    try {
      const response = await apiService.submitScore({
        username: userData.username,
        gameId,
        score,
      });

      if (response) {
        console.log("Score submitted successfully:", score);
        // Optionally show a success message to the user
      }
    } catch (error) {
      console.error("Failed to submit score:", error);
      // Optionally show an error message to the user
    }
  };

  const renderGame = () => {
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

    if (!game) return null;

    switch (gameId) {
      case "tetris-classic":
        return <TetrisGame onScoreUpdate={handleScoreSubmit} />;
      default:
        return (
          <div className="game-error">
            <h2>Game Not Available</h2>
            <button onClick={handleReturnToGames} className="return-button">
              Return to Games
            </button>
          </div>
        );
    }
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
      <div className="game-header">
        <h1>{game?.title || "Game"}</h1>
        <button onClick={handleReturnToGames} className="return-button">
          ← Back to Games
        </button>
      </div>
      <div className="game-container">{renderGame()}</div>
    </div>
  );
};

export default GameView;
