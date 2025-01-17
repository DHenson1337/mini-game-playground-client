// src/pages/GameView.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
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

  // Get user data once and memoize it
  const userData = useMemo(() => getUserFromSession(), []);

  // Fetch game data
  useEffect(() => {
    if (!userData) {
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

    // Cleanup function
    return () => {
      isSubscribed = false;
    };
  }, [gameId, navigate, userData]);

  // Memoize the score submission handler
  const handleScoreSubmit = useCallback(
    async (score) => {
      if (!userData?.username || !gameId) {
        console.error("Missing user data or game ID");
        return;
      }

      try {
        console.log("Submitting score:", {
          username: userData.username,
          gameId,
          score,
        });

        const response = await apiService.submitScore({
          username: userData.username,
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
    [userData?.username, gameId]
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
