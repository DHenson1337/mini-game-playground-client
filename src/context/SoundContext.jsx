import React, { createContext, useContext, useState, useCallback } from "react";
import useSound from "use-sound";

//  sounds
const SOUNDS = {
  click: "/assets/sounds/click.wav",
  hover: "/assets/sounds/hover.ogg",
  success: "/assets/sounds/success.wav",
  error: "/assets/sounds/error.mp3",
  bgm: "/assets/sounds/bgm.mp3",
};

const SoundContext = createContext(null);

export function SoundProvider({ children }) {
  const [isMuted, setIsMuted] = useState(() => {
    // Check if user previously muted sounds
    const stored = localStorage.getItem("mgp_sound_muted");
    return stored ? JSON.parse(stored) : false;
  });

  const [volume, setVolume] = useState(() => {
    // Get stored volume or default to 0.5
    const stored = localStorage.getItem("mgp_sound_volume");
    return stored ? JSON.parse(stored) : 0.5;
  });

  // Sound hooks
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
  const [playBGM, { stop: stopBGM }] = useSound(SOUNDS.bgm, {
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

// Custom hook for using sound - renamed to useSoundSystem
export function useSoundSystem() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error("useSoundSystem must be used within a SoundProvider");
  }
  return context;
}

export default SoundContext;
