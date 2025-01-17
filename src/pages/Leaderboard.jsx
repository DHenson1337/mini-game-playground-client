import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getGameImage } from "../utils/gameImages";
import API_URLS from "../utils/apiUrls";
import { getAvatarImage } from "../utils/avatarUtils";
import { apiService } from "../utils/apiService";
import socketClient from "../services/socketClient";
import "./styles/Leaderboard.css";

const SCORES_PER_PAGE = 10;

const Leaderboard = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState("tetris-classic");
  const [allScores, setAllScores] = useState([]);
  const [displayedScores, setDisplayedScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGameTitle, setSelectedGameTitle] = useState("Tetris Classic");
  const [lastUpdate, setLastUpdate] = useState(null); // For showing update status

  // Fetch games
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await apiService.fetchGames();
        const enabledGames = (data.games || []).filter((game) => game.enabled);
        setGames(enabledGames);

        const initialGame = enabledGames.find(
          (game) => game.gameId === selectedGame
        );
        if (initialGame) {
          setSelectedGameTitle(initialGame.title);
        }
      } catch (error) {
        setError("Failed to load games");
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, [selectedGame]);

  // Socket.IO connection and listeners
  useEffect(() => {
    // Connect to Socket.IO
    socketClient.connect();

    // Join the game room
    socketClient.joinGame(selectedGame);

    // Listen for score updates
    socketClient.onScoreUpdate(selectedGame, (data) => {
      setAllScores((prevScores) => {
        // Add new score and resort
        const newScores = [...prevScores, data.score]
          .sort((a, b) => b.score - a.score)
          .slice(0, 100); // Keep only top 100

        setLastUpdate(new Date().toLocaleTimeString());
        return newScores;
      });
    });

    // Cleanup on unmount or game change
    return () => {
      socketClient.leaveGame(selectedGame);
    };
  }, [selectedGame]);

  // Fetch scores
  useEffect(() => {
    const fetchScores = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URLS.SCORES}/game/${selectedGame}`);
        if (!response.ok) {
          throw new Error("Failed to fetch scores");
        }
        const data = await response.json();

        // Sort scores by highest first
        const sortedScores = data.sort((a, b) => b.score - a.score);
        setAllScores(sortedScores);
      } catch (error) {
        console.error("Error fetching scores:", error);
        setError("Failed to load scores");
      } finally {
        setIsLoading(false);
      }
    };

    fetchScores();
  }, [selectedGame]);

  // Update displayed scores on page change
  useEffect(() => {
    const startIndex = (currentPage - 1) * SCORES_PER_PAGE;
    const endIndex = startIndex + SCORES_PER_PAGE;
    setDisplayedScores(allScores.slice(startIndex, endIndex));
  }, [currentPage, allScores]);

  const handleGameChange = (e) => {
    const gameId = e.target.value;
    setSelectedGame(gameId);
    const selectedGame = games.find((game) => game.gameId === gameId);
    if (selectedGame) {
      setSelectedGameTitle(selectedGame.title);
    }
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    const maxPages = Math.max(1, Math.ceil(allScores.length / SCORES_PER_PAGE));
    setCurrentPage((prev) => Math.min(maxPages, prev + 1));
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-text">Loading scores...</div>
    </div>
  );

  // Calculate pagination values
  const startRank = (currentPage - 1) * SCORES_PER_PAGE + 1;
  const maxPages = Math.max(1, Math.ceil(allScores.length / SCORES_PER_PAGE));

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        {/* Left Panel - Scores */}
        <div className="scores-panel">
          <div className="scores-header">
            <h2>Top 100 HighScores</h2>
            {lastUpdate && (
              <div className="last-update">Last update: {lastUpdate}</div>
            )}
          </div>

          <div className="game-selector">
            <select
              value={selectedGame}
              onChange={handleGameChange}
              className="game-select"
            >
              {games.map((game) => (
                <option key={game.gameId} value={game.gameId}>
                  {game.title}
                </option>
              ))}
            </select>
          </div>

          <div className="scores-list">
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <div className="page-info">
                  Showing {startRank} -{" "}
                  {Math.min(startRank + SCORES_PER_PAGE - 1, allScores.length)}{" "}
                  of {allScores.length}
                </div>

                <div className="scores-table">
                  {displayedScores.length > 0 ? (
                    displayedScores
                      .map((score, index) => {
                        if (!score.userId) return null;

                        return (
                          <div
                            key={score._id || index}
                            className={`score-row ${
                              score.isNew ? "new-score" : ""
                            }`}
                          >
                            <div className="rank">{startRank + index}</div>
                            <div className="player-info">
                              <img
                                src={getAvatarImage(
                                  score.userId?.avatar || "default"
                                )}
                                alt={`${
                                  score.userId?.username || "Deleted User"
                                }'s avatar`}
                                className="player-avatar"
                              />
                              <span className="username">
                                {score.userId?.username || "Deleted User"}
                              </span>
                            </div>
                            <div className="score">{score.score}</div>
                          </div>
                        );
                      })
                      .filter(Boolean)
                  ) : (
                    <div className="no-scores">No scores available</div>
                  )}
                </div>

                <div className="pagination">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="nav-button prev"
                  >
                    Prev
                  </button>
                  <span className="page-number">
                    Page {currentPage} of {maxPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage >= maxPages}
                    className="nav-button next"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Game Preview */}
        <div className="preview-panel">
          <h2 className="preview-title">{selectedGameTitle}</h2>
          {selectedGame && (
            <div className="game-preview">
              <img
                src={getGameImage(selectedGame, "preview")}
                alt={`${selectedGameTitle} preview`}
                className="preview-image"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
