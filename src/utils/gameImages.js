// src/utils/gameImages.js
const gameImages = {
  "tetris-classic": {
    card: "/assets/games/tetris/tetris-thumb.png",
    preview: "/assets/games/tetris/preview.gif",
  },
  "tic-tac-toe": {
    card: "/assets/games/tic-tac-toe/tictactoe-thumb.png",
    preview: "/assets/games/tic-tac-toe/preview.gif",
  },
  snake: {
    card: "/assets/games/snake/snake-thumb.png",
    preview: "/assets/games/snake/preview.gif",
  },
  "coming-soon": {
    card: "/assets/placeholders/coming-soon.png",
    preview: "/assets/placeholders/coming-soon.png",
  },
};

export const getGameImage = (gameId, type = "card") => {
  return gameImages[gameId]?.[type] || gameImages["coming-soon"][type];
};
