import { useEffect } from "react";
import { useLocation } from "react-router";
import { useSoundSystem } from "../context/SoundContext";

// Define BGM for specific pages only
const BGM_MAPPING = {
  "/": "/assets/sounds/landing-bgm.mp3", // Landing page only
  "/games/tetris-classic": "/assets/sounds/tetris/tetris-bgm.mp3", // Tetris
  // Add other game BGMs here
};

const PageMusic = () => {
  const location = useLocation();
  const { playBGM, stopBGM } = useSoundSystem();

  useEffect(() => {
    // Get BGM for current path
    const bgmPath = BGM_MAPPING[location.pathname];

    if (bgmPath) {
      // Only play music on landing page and specific game pages
      playBGM(bgmPath);
    } else {
      // Stop any playing music if we're on any other page
      stopBGM();
    }

    // Cleanup when component unmounts or route changes
    return () => {
      stopBGM();
    };
  }, [location.pathname, playBGM, stopBGM]);

  return null;
};

export default PageMusic;
