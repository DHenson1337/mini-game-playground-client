import React, { useEffect, useState } from "react";

const FontLoader = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Function to check if the font is loaded
    const checkFontLoaded = async () => {
      try {
        await document.fonts.load('10px "Press Start 2P"');
        setFontsLoaded(true);
        document.documentElement.classList.add("fonts-loaded");
      } catch (error) {
        console.warn("Failed to load font:", error);
        document.documentElement.classList.add("fonts-failed");
      }
    };

    // Add the Google Fonts link dynamically
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    // Check font loading
    link.onload = checkFontLoaded;
    link.onerror = () => {
      console.warn("Failed to load font stylesheet");
      document.documentElement.classList.add("fonts-failed");
      setFontsLoaded(true); // Allow the app to continue with fallback font
    };

    // Cleanup
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Don't show loading indicator, just render null
  // This prevents a flash of loading state
  return null;
};

export default FontLoader;
