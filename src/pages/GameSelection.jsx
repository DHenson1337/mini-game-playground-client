import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./styles/GameSelection.css";
import API_URLS from "../utils/apiUrls";
import { getGameImage } from "../utils/gameImages";

const GameSelection = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch games from backend
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(API_URLS.GAMES);
        if (!response.ok) {
          throw new Error("Failed to fetch games");
        }
        const data = await response.json();
        setGames(data);
        // Set the first game as selected by default
        if (data.length > 0) {
          setSelectedGame(data[0]);
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

  // Handle game selection
  const handleGameSelect = (game) => {
    if (game.enabled) {
      setSelectedGame(game);
    }
  };

  // Handle play button click
  const handlePlayGame = () => {
    if (selectedGame?.enabled) {
      navigate(`/games/${selectedGame.gameId}`); // Using navigate
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading games...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <p>
          Error:{" "}
          {`Sorry the game server is Down :< 
        \n
        ${error}
        `}
        </p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  // If no games are found
  if (games.length === 0) {
    return (
      <div className="no-games-container">
        <p>No games available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="game-selection-container">
      {/* Game Grid Section */}
      <div className="game-grid-section">
        <h1 className="grid-title">Choose Your Game!</h1>
        <div className="game-grid">
          {/* Top row: 4 games */}
          <div className="grid-row top-row">
            {games.slice(0, 4).map((game) => (
              <div
                key={game.id}
                className={`game-card ${!game.enabled ? "disabled" : ""} 
                          ${selectedGame?.id === game.id ? "selected" : ""}`}
                onClick={() => handleGameSelect(game)}
              >
                <img src={getGameImage(game.gameId)} alt={game.title} />
                <div className="game-card-title">{game.title}</div>
              </div>
            ))}
          </div>

          {/* Bottom row: 3 games */}
          <div className="grid-row bottom-row">
            {games.slice(4, 7).map((game) => (
              <div
                key={game.id}
                className={`game-card ${!game.enabled ? "disabled" : ""} 
                          ${selectedGame?.id === game.id ? "selected" : ""}`}
                onClick={() => handleGameSelect(game)}
              >
                <img src={getGameImage(game.gameId)} alt={game.title} />
                <div className="game-card-title">{game.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Preview Section */}
      {selectedGame && (
        <div className="game-preview-section">
          <div className="preview-left">
            <h2>{selectedGame.title}</h2>
            <div className="preview-image-container">
              <img
                src={getGameImage(selectedGame.gameId, "preview")}
                alt={selectedGame.title}
                className="preview-image"
              />
            </div>
          </div>

          <div className="preview-right">
            <div className="game-info">
              <h3>Game Description:</h3>
              <p>{selectedGame.description}</p>

              {selectedGame.rules && selectedGame.rules.length > 0 && (
                <>
                  <h3>Game Rules:</h3>
                  <ul className="game-rules">
                    {selectedGame.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </>
              )}

              {selectedGame.enabled && (
                <button className="play-button" onClick={handlePlayGame}>
                  Play Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSelection;
