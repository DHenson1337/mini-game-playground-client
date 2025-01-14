import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getGameImage } from "../utils/gameImages";
import API_URLS from "../utils/apiUrls";
import { getAvatarImage } from "../utils/avatarUtils";
import "./styles/Leaderboard.css";

// Constants for pagination
const SCORES_PER_PAGE = 10;
const MAX_SCORES = 100;

const Leaderboard = () => {
  const navigate = useNavigate();

  // State Management
  const [selectedGame, setSelectedGame] = useState("apple-catcher");
  const [allScores, setAllScores] = useState([]);
  const [displayedScores, setDisplayedScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGameTitle, setSelectedGameTitle] = useState("Apple Catcher");

  // Fetch available games on component mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(API_URLS.GAMES);
        if (!response.ok) throw new Error("Failed to fetch games");
        const data = await response.json();
        const enabledGames = data.filter((game) => game.enabled);
        setGames(enabledGames);

        // Set initial game title
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
  }, []);

  // Update displayed scores when page changes or scores update
  useEffect(() => {
    const startIndex = (currentPage - 1) * SCORES_PER_PAGE;
    const endIndex = startIndex + SCORES_PER_PAGE;
    setDisplayedScores(allScores.slice(startIndex, endIndex));
  }, [currentPage, allScores]);

  // Fetch leaderboard data when selected game changes
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URLS.SCORES}/game/${selectedGame}`);
        if (!response.ok) throw new Error("Failed to fetch leaderboard");
        const data = await response.json();

        // Filter out scores with missing user data
        const validScores = data.filter(
          (score) =>
            score.userId && score.userId.username && score.userId.avatar
        );
        setAllScores(validScores);
        setCurrentPage(1); // Reset to first page when changing games
        setError(null);
      } catch (error) {
        setError("Failed to load leaderboard");
        console.error("Error fetching leaderboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedGame) {
      fetchLeaderboard();
    }
  }, [selectedGame]);

  // Handle game selection change
  const handleGameChange = (e) => {
    const gameId = e.target.value;
    setSelectedGame(gameId);
    const selectedGame = games.find((game) => game.gameId === gameId);
    if (selectedGame) {
      setSelectedGameTitle(selectedGame.title);
    }
    setCurrentPage(1);
  };

  // Pagination handlers
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

  // Error state
  if (error) {
    return (
      <div className="leaderboard-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Calculate pagination values
  const startRank = (currentPage - 1) * SCORES_PER_PAGE + 1;
  const maxPages = Math.max(1, Math.ceil(allScores.length / SCORES_PER_PAGE));

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        {/* Left Panel - Scores */}
        <div className="scores-panel">
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
            <h2>Top 100 HighScores</h2>
            <div className="page-info">
              Showing {startRank} -{" "}
              {Math.min(startRank + SCORES_PER_PAGE - 1, allScores.length)} of{" "}
              {allScores.length}
            </div>

            {/* Scores Display */}
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="scores-table">
                {displayedScores.length > 0 ? (
                  displayedScores.map((score, index) => (
                    <div key={score._id || index} className="score-row">
                      <div className="rank">{startRank + index}</div>
                      <div className="player-info">
                        <img
                          src={getAvatarImage(score.userId.avatar)}
                          alt={`${score.userId.username}'s avatar`}
                          className="player-avatar"
                        />
                        <span className="username">
                          {score.userId.username}
                        </span>
                      </div>
                      <div className="score">{score.score}</div>
                    </div>
                  ))
                ) : (
                  <div className="no-scores">No scores available</div>
                )}
              </div>
            )}

            {/* Pagination Controls */}
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
