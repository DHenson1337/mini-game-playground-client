import { useEffect } from "react";
import { useLocation } from "react-router";
import { useSoundSystem } from "../context/SoundContext";

// Define BGM for specific pages
const BGM_MAPPING = {
  "/": "/assets/sounds/landing-bgm.mp3",
  "/games/tetris-classic": "/assets/sounds/tetris/tetris-bgm.mp3",
  "/games/tic-tac-toe": "/assets/sounds/tictactoe/tictactoe-bgm.mp3",
  "/games/snake": "/assets/sounds/snake/snake-bgm.mp3",
};

const LAST_BGM_KEY = "last_bgm_path";

const PageMusic = () => {
  const location = useLocation();
  const { playBGM, stopBGM } = useSoundSystem();
  const isGamePage = location.pathname.startsWith("/games/");

  useEffect(() => {
    const bgmPath = BGM_MAPPING[location.pathname];
    const storedBgmPath = localStorage.getItem(LAST_BGM_KEY);

    if (bgmPath) {
      // We have a specific BGM for this page
      localStorage.setItem(LAST_BGM_KEY, bgmPath);
      playBGM(bgmPath);
    } else if (isGamePage && storedBgmPath) {
      // We're on a game page and have a stored BGM
      playBGM(storedBgmPath);
    } else if (!isGamePage && location.pathname !== "/") {
      // Not a game page or landing page
      stopBGM();
      localStorage.removeItem(LAST_BGM_KEY);
    }

    return () => {
      if (!isGamePage && !BGM_MAPPING[location.pathname]) {
        stopBGM();
        localStorage.removeItem(LAST_BGM_KEY);
      }
    };
  }, [location.pathname, playBGM, stopBGM, isGamePage]);

  return null;
};

export default PageMusic;
