import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useSoundSystem } from "../context/SoundContext";

const BGM_MAPPING = {
  "/": "/assets/sounds/landing-bgm.mp3",
  "/games/tetris-classic": "/assets/sounds/tetris/tetris-bgm.mp3",
  "/games/tic-tac-toe": "/assets/sounds/tictactoe/tictactoe-bgm.mp3",
  "/games/snake": "/assets/sounds/snake/snake-bgm.mp3",
};

const LAST_BGM_KEY = "last_bgm_path";
const CURRENT_PAGE_BGM_KEY = "current_page_bgm";

const PageMusic = () => {
  const location = useLocation();
  const { playBGM, stopBGM, isMuted, isPlaying } = useSoundSystem();
  const lastPathRef = useRef(location.pathname);
  const isGamePage = location.pathname.startsWith("/games/");
  const [isInitialized, setIsInitialized] = useState(false);

  // Helper to get the appropriate BGM for the current page
  const getCurrentPageBgm = () => {
    const bgmPath = BGM_MAPPING[location.pathname];
    if (bgmPath) {
      return bgmPath;
    } else if (isGamePage) {
      const storedBgmPath = localStorage.getItem(LAST_BGM_KEY);
      return storedBgmPath || null;
    }
    return null;
  };

  // Handle initial page load and refresh
  useEffect(() => {
    const handleInitialLoad = async () => {
      if (isMuted || isInitialized) return;

      const currentBgm = getCurrentPageBgm();
      if (currentBgm) {
        // Store the current BGM path
        localStorage.setItem(CURRENT_PAGE_BGM_KEY, currentBgm);
        if (isGamePage) {
          localStorage.setItem(LAST_BGM_KEY, currentBgm);
        }

        // Play the BGM
        await playBGM(currentBgm);
      }

      setIsInitialized(true);
    };

    // Small delay to ensure proper initialization
    const timeoutId = setTimeout(handleInitialLoad, 100);
    return () => clearTimeout(timeoutId);
  }, [isMuted, isInitialized, playBGM, isGamePage]);

  // Handle page navigation
  useEffect(() => {
    if (isMuted) return;

    const handleBgmChange = async () => {
      const bgmPath = BGM_MAPPING[location.pathname];
      const storedBgmPath = localStorage.getItem(LAST_BGM_KEY);

      // Different page, different music needs
      if (location.pathname !== lastPathRef.current) {
        if (bgmPath) {
          localStorage.setItem(LAST_BGM_KEY, bgmPath);
          localStorage.setItem(CURRENT_PAGE_BGM_KEY, bgmPath);
          await playBGM(bgmPath);
        } else if (isGamePage && storedBgmPath) {
          localStorage.setItem(CURRENT_PAGE_BGM_KEY, storedBgmPath);
          await playBGM(storedBgmPath);
        } else if (!isGamePage && location.pathname !== "/") {
          stopBGM();
          localStorage.removeItem(CURRENT_PAGE_BGM_KEY);
          localStorage.removeItem(LAST_BGM_KEY);
        }

        lastPathRef.current = location.pathname;
      }
    };

    handleBgmChange();

    return () => {
      if (!isGamePage && location.pathname !== lastPathRef.current) {
        stopBGM();
        localStorage.removeItem(CURRENT_PAGE_BGM_KEY);
      }
    };
  }, [location.pathname, playBGM, stopBGM, isGamePage, isMuted]);

  // Handle browser refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentBgm = getCurrentPageBgm();
      if (currentBgm) {
        localStorage.setItem(CURRENT_PAGE_BGM_KEY, currentBgm);
        if (isGamePage) {
          localStorage.setItem(LAST_BGM_KEY, currentBgm);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isGamePage]);

  // Handle page visibility change
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (isMuted) return;

      if (document.hidden) {
        stopBGM();
      } else {
        const currentBgm = localStorage.getItem(CURRENT_PAGE_BGM_KEY);
        if (currentBgm && !isPlaying) {
          await playBGM(currentBgm);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isMuted, isPlaying, playBGM, stopBGM]);

  return null;
};

export default PageMusic;
