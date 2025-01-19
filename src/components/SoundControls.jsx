import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useSoundSystem } from "../context/SoundContext";
import "./styles/SoundControls.css";

const SoundControls = () => {
  const { isMuted, volume, toggleMute, updateVolume, playSoundEffect } =
    useSoundSystem();

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    updateVolume(newVolume);
  };

  const handleToggleMute = () => {
    toggleMute();
    playSoundEffect("click");
  };

  return (
    <div className="sound-controls">
      <button
        className="sound-toggle-btn"
        onClick={handleToggleMute}
        onMouseEnter={() => playSoundEffect("hover")}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      {!isMuted && (
        <div className="volume-slider-container">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      )}
    </div>
  );
};

export default SoundControls;
