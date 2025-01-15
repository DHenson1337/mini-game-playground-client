// Game configuration constants
const sizes = {
  width: 500,
  height: 500,
};

// Game difficulty and speed settings
const baseSpeedDown = 450; // Base falling speed for apples
const maxSpeedDown = 1500; // Maximum possible falling speed
const speedIncreaseInterval = 5000; // Speed increases every 5 seconds
const speedIncreaseAmount = 100; // How much speed increases each interval

/**
 * Main game scene class handling all game logic and rendering
 */
class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");

    // Core game objects
    this.player = null; // Player's basket
    this.target = null; // Current falling apple
    this.cursor = null; // Keyboard input
    this.playerSpeed = baseSpeedDown + 130; // Player movement speed

    // Score system
    this.points = 0;
    this.textScore = null;
    this.highScore = localStorage.getItem("appleHighScore") || 0;

    // Time management
    this.textTime = null;
    this.timedEvent = null;
    this.remainingTime = null;

    // Game mechanics
    this.currentSpeed = baseSpeedDown;
    this.speedIncreaseTimer = null;
    this.isTouchActive = false;
    this.touchStartX = 0;

    // Audio system
    this.coinMusic = null;
    this.bgMusic = null;
    this.negativeSound = null;

    // Visual effects
    this.emitter = null;

    // Apple types and their properties
    this.appleTypes = {
      normal: {
        key: "apple",
        points: 1,
        speed: this.currentSpeed,
      },
      golden: {
        key: "goldenApple",
        points: 4,
        speed: this.currentSpeed * 1.5,
      },
      rotten: {
        key: "rottenApple",
        points: -5,
        speed: this.currentSpeed * 0.8,
      },
    };

    // Bind methods to maintain proper 'this' context
    this.handleKeyboardControls = this.handleKeyboardControls.bind(this);
    this.targetHit = this.targetHit.bind(this);
    this.gameOver = this.gameOver.bind(this);
  }

  /**
   * Preload all game assets (images and sounds)
   */
  preload() {
    // Load all image assets
    const imagePaths = {
      bg: "/games/apple-catcher/assets/images/bg.png",
      goldenApple: "/games/apple-catcher/assets/images/goldenApple.png",
      rottenApple: "/games/apple-catcher/assets/images/rottenApple.png",
      basket: "/games/apple-catcher/assets/images/basket.png",
      apple: "/games/apple-catcher/assets/images/apple.png",
      money: "/games/apple-catcher/assets/images/money.png",
    };

    Object.entries(imagePaths).forEach(([key, path]) => {
      this.load.image(key, path);
    });

    // Load all audio assets
    const audioPaths = {
      coin: "/games/apple-catcher/assets/sounds/coin.wav",
      bgMusic: "/games/apple-catcher/assets/sounds/bgMusic.mp3",
      negative: "/games/apple-catcher/assets/sounds/negative.mp3",
      gameOver: "/games/apple-catcher/assets/sounds/gameOver.mp3",
      victory: "/games/apple-catcher/assets/sounds/victory.wav",
    };

    Object.entries(audioPaths).forEach(([key, path]) => {
      this.load.audio(key, path);
    });
  }
  /**
   * Create and initialize all game elements
   */
  create() {
    // Start in paused state until player clicks start
    // this.scene.pause();

    // Initialize all game systems
    this.setupAudio();
    this.setupPlayer();
    this.setupApple();
    this.setupCollision();
    this.setupSpeedTimer();
    this.setupControls();
    this.setupUI();
    this.setupParticles();

    // Initialize first apple
    this.spawnApple();
  }

  /**
   * Setup audio system with proper volume levels
   */
  setupAudio() {
    // Cleanup any existing audio instances
    if (this.bgMusic) this.bgMusic.destroy();
    if (this.coinMusic) this.coinMusic.destroy();
    if (this.negativeSound) this.negativeSound.destroy();

    // Create new audio instances with appropriate volumes
    this.bgMusic = this.sound.add("bgMusic", {
      loop: true,
      volume: 0.5,
    });
    this.coinMusic = this.sound.add("coin", {
      volume: 0.3,
    });
    this.negativeSound = this.sound.add("negative", {
      volume: 0.3,
    });
  }

  /**
   * Setup player character (basket) and physics
   */
  setupPlayer() {
    // Add background
    this.add.image(0, 0, "bg").setOrigin(0, 0);

    // Create player basket with physics
    this.player = this.physics.add
      .image(0, sizes.height - 100, "basket")
      .setOrigin(0, 0)
      .setImmovable(true);

    // Configure physics properties
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);

    // Adjust hitbox for better collision detection
    this.player
      .setSize(
        this.player.width - this.player.width / 4,
        this.player.height / 6
      )
      .setOffset(
        this.player.width / 10,
        this.player.height - this.player.height / 10
      );
  }

  /**
   * Setup falling apple physics and properties
   */
  setupApple() {
    this.target = this.physics.add.image(0, 0, "apple").setOrigin(0, 0);
    this.target.setMaxVelocity(0, baseSpeedDown);
  }

  /**
   * Setup collision detection between player and apple
   */
  setupCollision() {
    this.physics.add.overlap(
      this.target,
      this.player,
      this.targetHit,
      null,
      this
    );
  }

  /**
   * Setup timer for increasing game speed
   */
  setupSpeedTimer() {
    this.speedIncreaseTimer = this.time.addEvent({
      delay: speedIncreaseInterval,
      callback: this.increaseSpeed,
      callbackScope: this,
      loop: true,
    });
  }

  /**
   * Setup player controls (keyboard and touch)
   */
  setupControls() {
    // Keyboard controls
    this.cursor = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      A: Phaser.Input.Keyboard.KeyCodes.A,
      D: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // Touch controls for mobile
    this.setupTouchControls();
  }

  /**
   * Setup touch input for mobile devices
   */
  setupTouchControls() {
    this.input.on("pointerdown", () => {
      this.isTouchActive = true;
    });

    this.input.on("pointermove", (pointer) => {
      if (this.isTouchActive) {
        const targetX = pointer.x - this.player.width / 2;
        const clampedX = Phaser.Math.Clamp(
          targetX,
          0,
          sizes.width - this.player.width
        );
        this.player.setX(clampedX);
      }
    });

    this.input.on("pointerup", () => {
      this.isTouchActive = false;
    });
  }

  /**
   * Setup game UI elements (score, timer, etc.)
   */
  setupUI() {
    // Score display
    this.textScore = this.add.text(sizes.width - 120, 10, "Score: 0", {
      font: "25px Arial",
      fill: "#000000",
    });

    // Timer display
    this.textTime = this.add.text(10, 10, "Remaining Time: 00", {
      font: "25px Arial",
      fill: "#000000",
    });

    // High score display
    this.highScoreText = this.add.text(
      10,
      40,
      `High Score: ${this.highScore}`,
      {
        font: "25px Arial",
        fill: "#FFD700",
      }
    );

    // Game timer (45 seconds)
    this.timedEvent = this.time.delayedCall(45000, this.gameOver, [], this);
  }

  /**
   * Setup particle effects for visual feedback
   */
  setupParticles() {
    this.emitter = this.add.particles(0, 0, "money", {
      speed: 100,
      gravityY: baseSpeedDown - 200,
      scale: 0.04,
      duration: 100,
      emitting: false,
    });

    // Make particles follow the player
    this.emitter.startFollow(
      this.player,
      this.player.width / 2,
      this.player.height / 2,
      true
    );
  }
  /**
   * Game update loop
   */
  update() {
    // Update timer display
    this.remainingTime = this.timedEvent.getRemainingSeconds();
    this.textTime.setText(
      `Remaining Time: ${Math.round(this.remainingTime).toString()}`
    );

    // Reset apple if it falls off screen
    if (this.target.y >= sizes.height) {
      this.target.setY(0);
      this.target.setX(this.getRandomX());
      this.spawnApple();
    }

    // Handle player movement
    if (!this.isTouchActive) {
      this.handleKeyboardControls();
    }
  }

  /**
   * Spawn a new apple with random type
   */
  spawnApple() {
    const rand = Math.random();
    let type;

    // Determine apple type based on probability
    if (rand < 0.15) {
      type = "golden"; // 15% chance for golden apple
    } else if (rand < 0.35) {
      type = "rotten"; // 20% chance for rotten apple
    } else {
      type = "normal"; // 65% chance for normal apple
    }

    const appleConfig = this.appleTypes[type];
    this.target.setTexture(appleConfig.key);

    // Configure apple size and hitbox based on type
    if (type === "golden") {
      this.target.setScale(0.01);
      this.target.body.setSize(780, 780);
      this.target.body.setOffset(-30, -30);
    } else if (type === "rotten") {
      this.target.setScale(0.05);
      this.target.body.setSize(720, 720);
      this.target.body.setOffset(-30, -30);
    } else {
      this.target.setScale(1);
      this.target.body.setSize(39, 39);
    }

    this.target.appleType = type;
    this.target.setMaxVelocity(0, appleConfig.speed);
  }

  /**
   * Handle keyboard controls for player movement
   */
  handleKeyboardControls() {
    const { left, right } = this.cursor;
    const { A, D } = this.keys;

    if (left.isDown || A.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown || D.isDown) {
      this.player.setVelocityX(this.playerSpeed);
    } else {
      this.player.setVelocityX(0);
    }
  }

  /**
   * Increase game speed over time
   */
  increaseSpeed() {
    if (this.currentSpeed < maxSpeedDown) {
      this.currentSpeed += speedIncreaseAmount;
      this.physics.world.gravity.y = this.currentSpeed;
      this.target.setMaxVelocity(0, this.currentSpeed);
    }
  }

  /**
   * Generate random X position for apple spawn
   */
  getRandomX() {
    return Math.floor(Math.random() * (sizes.width - 20));
  }

  /**
   * Handle collision between basket and apple
   */
  targetHit() {
    const appleType = this.target.appleType || "normal";
    const points = this.appleTypes[appleType].points;

    // Update score
    this.points += points;
    this.textScore.setText(`Score: ${this.points}`);

    // Play effects based on apple type
    if (points > 0) {
      this.coinMusic.play();
      this.emitter.start();
    } else {
      this.negativeSound.play();
      this.player.setTint(0xff0000);
      this.time.delayedCall(300, () => {
        this.player.clearTint();
      });
    }

    // Reset apple position
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.spawnApple();
  }

  /**
   * Handle game over state
   */
  gameOver() {
    // Stop background music
    if (this.bgMusic) {
      this.bgMusic.stop();
    }

    // Play appropriate sound
    if (this.points >= 30) {
      this.sound.play("victory");
    } else {
      this.sound.play("gameOver");
    }

    // Update high score if necessary
    if (this.points > this.highScore) {
      this.highScore = this.points;
      localStorage.setItem("appleHighScore", this.points);
    }

    // Submit score and cleanup after delay
    this.time.delayedCall(1500, () => {
      // Submit score to React component
      if (this.game.onScoreSubmit) {
        this.game.onScoreSubmit(this.points);
      }

      // Notify React component of game end
      const gameEndEvent = new CustomEvent("gameEnd", {
        detail: {
          score: this.points,
          won: this.points >= 30,
        },
      });
      document.dispatchEvent(gameEndEvent);
    });
  }

  /**
   * Clean up resources when scene is shut down
   */
  shutdown() {
    // Clean up audio
    if (this.bgMusic) {
      this.bgMusic.stop();
      this.bgMusic.destroy();
    }
    if (this.coinMusic) {
      this.coinMusic.destroy();
    }
    if (this.negativeSound) {
      this.negativeSound.destroy();
    }

    // Clean up timers
    if (this.speedIncreaseTimer) {
      this.speedIncreaseTimer.destroy();
    }
    if (this.timedEvent) {
      this.timedEvent.destroy();
    }

    // Clean up particles
    if (this.emitter) {
      this.emitter.destroy();
    }

    // Remove event listeners
    this.input.keyboard.shutdown();
    this.input.off("pointerdown");
    this.input.off("pointermove");
    this.input.off("pointerup");
  }
}

/**
 * Wrapper class for React integration
 */
class AppleCatcherGame {
  constructor(config) {
    this.config = config;
    this.game = null;
    this.init();
  }

  init() {
    const gameConfig = {
      type: Phaser.WEBGL,
      width: sizes.width,
      height: sizes.height,
      parent: "gameCanvas",
      backgroundColor: "#000000",
      pixelArt: true,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: baseSpeedDown },
          debug: false,
        },
      },
      scene: GameScene,
    };

    this.game = new Phaser.Game(gameConfig);
    this.game.onScoreSubmit = this.config.onScoreSubmit;
  }

  destroy() {
    if (this.game) {
      const scene = this.game.scene.getScene("scene-game");
      if (scene) {
        scene.shutdown();
      }
      this.game.destroy(true);
      this.game = null;
    }
  }
}

// Make available globally
window.AppleCatcherGame = AppleCatcherGame;
