// src/utils/gameImages.js
const gameImages = {
  "apple-catcher": {
    card: "/assets/games/apple-catcher/card.png",
    preview: "/assets/games/apple-catcher/preview.png",
  },
  "coming-soon": {
    card: "/assets/placeholders/coming-soon.png",
    preview: "/assets/placeholders/coming-soon.png",
  },
};

export const getGameImage = (gameId, type = "card") => {
  return gameImages[gameId]?.[type] || gameImages["coming-soon"][type];
};
