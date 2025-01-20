import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./styles/GameSelection.css";
import { apiService } from "../utils/apiService";
import API_URLS from "../utils/apiUrls";
import Loading from "../components/Loading";
import { useSoundSystem } from "../context/SoundContext";
import ArcadePlayButton from "../components/ArcadePlayButton";

const GameSelection = () => {
  const { playSoundEffect } = useSoundSystem();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch games from backend
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await apiService.fetchGames();
        setGames(data.games || []);
        if (data.games?.length > 0) {
          setSelectedGame(data.games[0]);
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching games:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  const handleGameSelect = (game) => {
    if (game.enabled) {
      setSelectedGame(game);
      playSoundEffect("click");
    }
  };

  const handlePlayGame = () => {
    if (selectedGame?.enabled) {
      navigate(`/games/${selectedGame.gameId}`);
    }
  };

  if (isLoading) {
    return <Loading message="Loading games..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="game-selection-container">
      <h1 className="selection-title">Choose Your Game</h1>

      {/* Game Grid */}
      <div className="games-grid">
        {games.map((game) => (
          <div
            key={game.gameId}
            className={`game-card ${!game.enabled ? "disabled" : ""} 
                      ${
                        selectedGame?.gameId === game.gameId ? "selected" : ""
                      }`}
            onClick={() => {
              playSoundEffect("click");
              handleGameSelect(game);
            }}
            onMouseEnter={() => game.enabled && playSoundEffect("hover")}
          >
            <div className="game-card-content">
              <img
                src={
                  game.thumbnailUrl || "/assets/placeholders/game-thumbnail.png"
                }
                alt={game.title}
                className="game-thumbnail"
              />
              <div className="game-card-info">
                <h3>{game.title}</h3>
                {!game.enabled && (
                  <span className="coming-soon">Coming Soon</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Game Preview Section */}
      {selectedGame && (
        <div className="game-preview">
          <div className="preview-content">
            <div className="preview-image">
              <img
                src={
                  selectedGame.previewUrl ||
                  "/assets/placeholders/game-preview.png"
                }
                alt={selectedGame.title}
              />
            </div>

            <div className="preview-info">
              <div className="preview-info-content">
                <h2>{selectedGame.title}</h2>
                <p className="game-description">{selectedGame.description}</p>

                {selectedGame.controls && selectedGame.controls.length > 0 && (
                  <div className="game-controls">
                    <h3>Controls:</h3>
                    <ul>
                      {selectedGame.controls.map((control, index) => (
                        <li key={index}>
                          <span className="control-key">{control.key}</span>:{" "}
                          {control.action}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedGame.rules && selectedGame.rules.length > 0 && (
                  <div className="game-rules">
                    <h3>Rules:</h3>
                    <ul>
                      {selectedGame.rules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Play Button */}
              {selectedGame.enabled && (
                <ArcadePlayButton
                  onClick={handlePlayGame}
                  isDisabled={!selectedGame.enabled}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSelection;
