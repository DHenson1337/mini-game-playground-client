import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import useSound from "use-sound";

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

  const [currentBgmPath, setCurrentBgmPath] = useState(null);
  const audioContextRef = useRef(null);
  const bgmPlayerRef = useRef(null);

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

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
  }, []);

  useEffect(() => {
    const handleInteraction = () => {
      initAudioContext();
    };

    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [initAudioContext]);

  const setupBgmPlayer = useCallback(
    async (bgmPath) => {
      if (!audioContextRef.current) return;

      try {
        if (bgmPlayerRef.current) {
          bgmPlayerRef.current.stop();
          bgmPlayerRef.current = null;
        }

        const response = await fetch(bgmPath);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContextRef.current.decodeAudioData(
          arrayBuffer
        );

        const player = {
          source: null,
          gainNode: audioContextRef.current.createGain(),
          isPlaying: false,
          start() {
            if (this.isPlaying) return;
            this.source = audioContextRef.current.createBufferSource();
            this.source.buffer = audioBuffer;
            this.source.loop = true;
            this.source.connect(this.gainNode);
            this.gainNode.connect(audioContextRef.current.destination);
            this.gainNode.gain.value = volume * 0.3;
            this.source.start(0);
            this.isPlaying = true;
          },
          stop() {
            if (!this.isPlaying) return;
            if (this.source) {
              this.source.stop();
              this.source.disconnect();
            }
            this.isPlaying = false;
          },
          updateVolume(newVolume) {
            this.gainNode.gain.value = newVolume * 0.3;
          },
        };

        bgmPlayerRef.current = player;
        return player;
      } catch (error) {
        console.error("Error setting up BGM:", error);
      }
    },
    [volume]
  );

  const playBGM = useCallback(
    async (bgmPath) => {
      if (!bgmPath || isMuted) return;

      try {
        initAudioContext();
        const player = await setupBgmPlayer(bgmPath);
        if (player) {
          player.start();
          setCurrentBgmPath(bgmPath);
        }
      } catch (error) {
        console.error("Error playing BGM:", error);
      }
    },
    [isMuted, setupBgmPlayer, initAudioContext]
  );

  const stopBGM = useCallback(() => {
    if (bgmPlayerRef.current) {
      bgmPlayerRef.current.stop();
      setCurrentBgmPath(null);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newValue = !prev;
      localStorage.setItem("mgp_sound_muted", JSON.stringify(newValue));

      if (newValue) {
        stopBGM();
      } else if (currentBgmPath) {
        // Use setTimeout to ensure state update has propagated
        setTimeout(() => playBGM(currentBgmPath), 0);
      }

      return newValue;
    });
  }, [currentBgmPath, playBGM, stopBGM]);

  const updateVolume = useCallback((newVolume) => {
    setVolume(newVolume);
    localStorage.setItem("mgp_sound_volume", JSON.stringify(newVolume));

    if (bgmPlayerRef.current) {
      bgmPlayerRef.current.updateVolume(newVolume);
    }
  }, []);

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
      }
    },
    [isMuted, playClick, playHover, playSuccess, playError]
  );

  useEffect(() => {
    return () => {
      if (bgmPlayerRef.current) {
        bgmPlayerRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const value = {
    isMuted,
    volume,
    currentBgmPath,
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
