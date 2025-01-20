import React, { useEffect, useState } from "react";

const BackgroundEffects = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Create initial particles
    const particleCount = 30;
    const initialParticles = Array.from(
      { length: particleCount },
      (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 8}s`,
        opacity: Math.random() * 0.3,
      })
    );
    setParticles(initialParticles);
  }, []);

  return (
    <>
      {/* Grid and scanlines are handled by CSS */}
      <div className="scanlines" />

      {/* Ambient glow points */}
      <div className="ambient-glow">
        <div className="glow-point" />
        <div className="glow-point" />
        <div className="glow-point" />
      </div>

      {/* Floating particles */}
      <div className="particles">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              animationDelay: particle.delay,
              "--particle-opacity": particle.opacity,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default BackgroundEffects;
