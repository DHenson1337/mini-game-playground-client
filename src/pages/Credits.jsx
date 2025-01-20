import React, { useState } from "react";
import { useSoundSystem } from "../context/SoundContext";
import "./styles/Credits.css";

const CREDITS_SECTIONS = {
  WEBSITE: "website",
  TETRIS: "tetris",
  TICTACTOE: "tictactoe",
  SNAKE: "snake",
};

const Credits = () => {
  const [activeSection, setActiveSection] = useState(CREDITS_SECTIONS.WEBSITE);
  const { playSoundEffect } = useSoundSystem();

  const handleSectionChange = (section) => {
    playSoundEffect("click");
    setActiveSection(section);
  };

  const websiteCredits = (
    <div className="credits-content">
      <h2>Website Credits</h2>

      <section className="credits-section">
        <h3>Sounds</h3>
        <ul>
          <li>
            <strong>Click Sound Effect:</strong>
            <a href="https://freesound.org/people/InspectorJ/sounds/411088/">
              "Bell, Candle Damper, A (H4n).wav"
            </a>{" "}
            by InspectorJ (www.jshaw.co.uk) of Freesound.org
          </li>
          <li>
            <strong>Hover Sound:</strong>
            <a href="https://freesound.org/s/237422/">Hover 1</a> by
            plasterbrain -- License: Creative Commons 0
          </li>
          <li>
            <strong>Menu Hover:</strong>
            <a href="https://freesound.org/s/611451/">UI Click Menu Hover</a> by
            EminYILDIRIM -- License: Attribution 4.0
          </li>
          <li>
            <strong>Button Click:</strong>
            <a href="https://freesound.org/s/506053/">Button Click 2.wav</a> by
            Mellau -- License: Attribution NonCommercial 4.0
          </li>
          <li>
            <strong>Success Sound:</strong>
            <a href="https://freesound.org/s/446111/">Success Jingle</a> by
            JustInvoke -- License: Attribution 4.0
          </li>
          <li>
            <strong>Error Sound:</strong>
            <a href="https://freesound.org/s/351500/">Error Sound</a> by
            thehorriblejoke -- License: Creative Commons 0
          </li>
          <li>
            <strong>Background Music:</strong>
            <a href="https://freesound.org/s/728588/">Menu_loop</a> by naomuhibu
            -- License: Creative Commons 0
          </li>
        </ul>
      </section>

      <section className="credits-section">
        <h3>Icons</h3>
        <p>All icons from game-icons.net under CC BY 3.0</p>
        <h4>By Lorc:</h4>
        <ul>
          <li>
            <a href="https://game-icons.net/1x1/lorc/cowled.html">
              Cowled Icon
            </a>
          </li>
          <li>
            <a href="https://game-icons.net/1x1/lorc/visored-helm.html">
              Visored helm Icon
            </a>
          </li>
          <li>
            <a href="https://game-icons.net/1x1/lorc/hood.html">Hood Icon</a>
          </li>
        </ul>

        <h4>By Delapouite:</h4>
        <ul>
          <li>
            <a href="https://game-icons.net/1x1/delapouite/female-vampire.html">
              Female vampire icon
            </a>
          </li>
          <li>
            <a href="https://game-icons.net/1x1/delapouite/vampire-dracula.html">
              Vampire Dracula icon
            </a>
          </li>
          <li>
            <a href="https://game-icons.net/1x1/delapouite/wizard-face.html">
              Wizard face icon
            </a>
          </li>
          <li>
            <a href="https://game-icons.net/1x1/delapouite/quick-man.html">
              Quick man icon
            </a>
          </li>
          <li>
            <a href="https://game-icons.net/1x1/delapouite/overlord-helm.html">
              Overlord helm icon
            </a>
          </li>
          <li>
            <a href="https://game-icons.net/1x1/delapouite/woman-elf-face.html">
              Female elf face icon
            </a>
          </li>
        </ul>

        <h4>By Cathelineau:</h4>
        <ul>
          <li>
            <a href="https://game-icons.net/1x1/cathelineau/witch-face.html">
              Witch face icon
            </a>
          </li>
        </ul>
      </section>

      <section className="credits-section">
        <h3>Other Assets</h3>
        <ul>
          <li>
            <strong>Audio Icon:</strong>
            <a href="https://icons8.com/icon/hfXXwcg8qpqT/audio">
              Audio Icon on/off
            </a>{" "}
            by Icons8
          </li>
          <li>
            <strong>Logo:</strong> Created using Logo.com
          </li>
        </ul>
      </section>
    </div>
  );

  const tetrisCredits = (
    <div className="credits-content">
      <h2>Tetris Game Credits</h2>

      <section className="credits-section">
        <h3>Game Implementation</h3>
        <p>Based on react-tetris package:</p>
        <ul>
          <li>
            Copyright (c) 2015 Matthew Brandly
            <br />
            <a href="https://www.npmjs.com/package/react-tetris?activeTab=code">
              NPM Package
            </a>
            <br />
            License: MIT
          </li>
        </ul>
      </section>

      <section className="credits-section">
        <h3>Audio</h3>
        <ul>
          <li>
            <strong>Line Clear:</strong>
            <a href="https://freesound.org/s/109662/">success.wav</a> by grunz
            -- License: Attribution 3.0
          </li>
          <li>
            <strong>Background Music:</strong>
            <a href="https://freesound.org/s/678988/">
              Plastic Adrenaline (Loop).mp3
            </a>{" "}
            by Adam_Zero -- License: Attribution 4.0
          </li>
          <li>
            <strong>Game Over:</strong>
            <a href="https://freesound.org/s/365782/">Game Over 04.wav</a> by
            MATRIXXX_ -- License: Creative Commons 0
          </li>
          <li>
            <strong>Move Sound:</strong>
            <a href="https://freesound.org/s/464903/">
              Arcade UI Move Cursor
            </a>{" "}
            by plasterbrain -- License: Creative Commons 0
          </li>
        </ul>
      </section>

      <section className="credits-section">
        <h3>Preview Image</h3>
        <ul>
          <li>
            Title: Tetris Artwork
            <br />
            Platform: Dribbble
            <br />
            <a href="https://dribbble.com/shots/9239848-Tetris/attachments/1283484?mode=media">
              Source Link
            </a>
          </li>
        </ul>
      </section>
    </div>
  );

  const ticTacToeCredits = (
    <div className="credits-content">
      <h2>Tic Tac Toe Credits</h2>

      <section className="credits-section">
        <h3>Audio</h3>
        <ul>
          <li>
            <strong>Background Music:</strong>
            <a href="https://freesound.org/s/678991/">
              Steady Hand (Loop).mp3
            </a>{" "}
            by Adam_Zero -- License: Attribution 4.0
          </li>
        </ul>
      </section>

      <section className="credits-section">
        <h3>Preview Image</h3>
        <ul>
          <li>
            Title: Cereal Tic Tac Toe
            <br />
            Platform: Tenor
            <br />
            <a href="https://tenor.com/view/cereal-tic-tac-toe-gif-9950777">
              Source Link
            </a>
          </li>
        </ul>
      </section>
    </div>
  );

  const snakeCredits = (
    <div className="credits-content">
      <h2>Snake Game Credits</h2>

      <section className="credits-section">
        <h3>Audio</h3>
        <ul>
          <li>
            <strong>Background Music:</strong>
            "Snake Charmer" by Steve Oxen
            <br />
            Licensed by Fesliyan Studios
            <br />
            <a href="https://www.fesliyanstudios.com/">Source Link</a>
          </li>
        </ul>
      </section>

      <section className="credits-section">
        <h3>Preview Image</h3>
        <ul>
          <li>
            Title: Quit Playing Games with Your Cravings
            <br />
            Creator: Akanksha Jain
            <br />
            Platform: Dribbble
            <br />
            <a href="https://dribbble.com/shots/14968252-Quit-playing-games-with-your-cravings/attachments/6687262?mode=media">
              Source Link
            </a>
          </li>
        </ul>
      </section>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case CREDITS_SECTIONS.WEBSITE:
        return websiteCredits;
      case CREDITS_SECTIONS.TETRIS:
        return tetrisCredits;
      case CREDITS_SECTIONS.TICTACTOE:
        return ticTacToeCredits;
      case CREDITS_SECTIONS.SNAKE:
        return snakeCredits;
      default:
        return websiteCredits;
    }
  };

  return (
    <div className="credits-container">
      <h1 className="credits-title">Credits</h1>

      <div className="credits-navigation">
        <button
          className={`nav-button ${
            activeSection === CREDITS_SECTIONS.WEBSITE ? "active" : ""
          }`}
          onClick={() => handleSectionChange(CREDITS_SECTIONS.WEBSITE)}
          onMouseEnter={() => playSoundEffect("hover")}
        >
          Website
        </button>
        <button
          className={`nav-button ${
            activeSection === CREDITS_SECTIONS.TETRIS ? "active" : ""
          }`}
          onClick={() => handleSectionChange(CREDITS_SECTIONS.TETRIS)}
          onMouseEnter={() => playSoundEffect("hover")}
        >
          Tetris
        </button>
        <button
          className={`nav-button ${
            activeSection === CREDITS_SECTIONS.TICTACTOE ? "active" : ""
          }`}
          onClick={() => handleSectionChange(CREDITS_SECTIONS.TICTACTOE)}
          onMouseEnter={() => playSoundEffect("hover")}
        >
          Tic Tac Toe
        </button>
        <button
          className={`nav-button ${
            activeSection === CREDITS_SECTIONS.SNAKE ? "active" : ""
          }`}
          onClick={() => handleSectionChange(CREDITS_SECTIONS.SNAKE)}
          onMouseEnter={() => playSoundEffect("hover")}
        >
          Snake
        </button>
      </div>

      <div className="credits-display">{renderContent()}</div>
    </div>
  );
};

export default Credits;
