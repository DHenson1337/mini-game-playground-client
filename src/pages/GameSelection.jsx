import { useNavigate } from "react-router";
import "./styles/GameSelection.css";

function GameSelection() {
  const navigate = useNavigate();

  // Placeholder game data -I'll move this to a proper config later
  const GAMES = [
    {
      id: "appleCatcher",
      title: "Apple Catcher",
      description: "Catch falling apples while avoiding the rotten ones!",
      image: "/placeholderAppleCatcher.png", // We'll add proper images later
      enabled: true,
    },
    // More games will be added here later
  ];
  return (
    <div className="game-selection">
      <h1>Choose Your Game</h1>
      <div className="game-grid">
        {GAMES.map((game) => (
          <div
            key={game.id}
            className={`game-card ${!game.enabled ? "disabled" : ""}`}
            onClick={() => game.enabled && navigate(`/games/${game.id}`)}
          >
            <img src={game.image} alt={game.title} className="game-image" />
            <div className="game-info">
              <h2>{game.title}</h2>
              <p>{game.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameSelection;
