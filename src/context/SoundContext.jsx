import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import useSound from "use-sound";

// Sound effects (not BGM)
const SOUNDS = {
  click: "/assets/sounds/click.wav",
  hover: "/assets/sounds/hover.ogg",
  success: "/assets/sounds/success.wav",
  error: "/assets/sounds/error.mp3",
};

const SoundContext = createContext(null);

export function SoundProvider({ children }) {
  const [isMuted, setIsMuted] = useState(() => {
    const stored = localStorage.getItem("mgp_sound_muted");
    return stored ? JSON.parse(stored) : false;
  });

  const [volume, setVolume] = useState(() => {
    const stored = localStorage.getItem("mgp_sound_volume");
    return stored ? JSON.parse(stored) : 0.5;
  });

  const [currentBgmPath, setCurrentBgmPath] = useState(
    "/assets/sounds/landing-bgm.mp3"
  );

  // Sound effects hooks
  const [playClick] = useSound(SOUNDS.click, {
    volume: volume * 0.5,
    disabled: isMuted,
  });
  const [playHover] = useSound(SOUNDS.hover, {
    volume: volume * 0.3,
    disabled: isMuted,
  });
  const [playSuccess] = useSound(SOUNDS.success, {
    volume: volume * 0.7,
    disabled: isMuted,
  });
  const [playError] = useSound(SOUNDS.error, {
    volume: volume * 0.7,
    disabled: isMuted,
  });

  // BGM hook
  const [playBgmSound, { stop: stopBgmSound }] = useSound(currentBgmPath, {
    volume: volume * 0.3,
    loop: true,
    disabled: isMuted,
  });

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newValue = !prev;
      localStorage.setItem("mgp_sound_muted", JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  // Update volume
  const updateVolume = useCallback((newVolume) => {
    setVolume(newVolume);
    localStorage.setItem("mgp_sound_volume", JSON.stringify(newVolume));
  }, []);

  // Sound effect function
  const playSoundEffect = useCallback(
    (type) => {
      if (isMuted) return;

      switch (type) {
        case "click":
          playClick();
          break;
        case "hover":
          playHover();
          break;
        case "success":
          playSuccess();
          break;
        case "error":
          playError();
          break;
        default:
          break;
      }
    },
    [isMuted, playClick, playHover, playSuccess, playError]
  );

  // BGM control functions
  const playBGM = useCallback(
    (bgmPath) => {
      if (bgmPath !== currentBgmPath) {
        stopBgmSound();
        setCurrentBgmPath(bgmPath);
      }
    },
    [currentBgmPath, stopBgmSound]
  );

  const stopBGM = useCallback(() => {
    stopBgmSound();
  }, [stopBgmSound]);

  // Effect to handle BGM playback
  useEffect(() => {
    if (!isMuted) {
      stopBgmSound();
      playBgmSound();
    }
    return () => stopBgmSound();
  }, [currentBgmPath, isMuted, playBgmSound, stopBgmSound]);

  const value = {
    isMuted,
    volume,
    toggleMute,
    updateVolume,
    playSoundEffect,
    playBGM,
    stopBGM,
  };

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}

export function useSoundSystem() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSoundSystem must be used within a SoundProvider");
  }
  return context;
}

export default SoundContext;
