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

    // Try-catch for localStorage access
    let savedHighScore = 0;
    try {
      savedHighScore = localStorage.getItem("appleHighScore") || 0;
    } catch (e) {
      console.log("Could not access localStorage");
    }

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
    this.highScore = savedHighScore;
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
    // Set initial game state first
    this.scene.pause();

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

    // Use arrow function to maintain 'this' binding
    this.game.events.on("startGame", () => {
      console.log("Starting game...");

      // Reset game state
      this.points = 0;
      this.textScore.setText("Score: 0");
      this.currentSpeed = baseSpeedDown;

      // Reset physics
      this.physics.world.resume();
      this.physics.world.gravity.y = this.currentSpeed;

      // Reset apple
      this.target.setVelocity(0, 0);
      this.target.setY(0);
      this.target.setX(this.getRandomX());

      // Start timer
      this.timedEvent = this.time.delayedCall(
        45000,
        () => this.gameOver(),
        [],
        this
      );

      // Start audio
      if (this.bgMusic && !this.bgMusic.isPlaying) {
        this.bgMusic.play();
      }

      // Resume scene and set initial velocity
      this.scene.resume();
      this.target.setVelocityY(this.currentSpeed);

      console.log("Game started with physics:", {
        gravity: this.physics.world.gravity.y,
        velocity: this.target.body.velocity.y,
      });
    });
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
    // this.timedEvent = this.time.delayedCall(45000, this.gameOver, [], this);
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
    // Use scene state instead of gameState
    if (this.scene.isPaused()) return;

    // Force gravity if it's not active
    if (this.target.body.velocity.y === 0 && !this.scene.isPaused()) {
      this.target.setVelocityY(this.currentSpeed);
      console.log("Reapplying velocity in update");
    }

    // Update timer display
    if (this.timedEvent) {
      this.remainingTime = this.timedEvent.getRemainingSeconds();
      this.textTime.setText(
        `Remaining Time: ${Math.round(this.remainingTime).toString()}`
      );
    }

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
   */ spawnApple() {
    const rand = Math.random();
    let type;

    if (rand < 0.15) {
      type = "golden";
    } else if (rand < 0.35) {
      type = "rotten";
    } else {
      type = "normal";
    }

    const appleConfig = this.appleTypes[type];

    // Reset apple position and physics
    this.target.setVelocity(0, 0);
    this.target.setAcceleration(0, 0);
    this.target.setY(0);
    this.target.setX(this.getRandomX());
    this.target.setTexture(appleConfig.key);
    this.target.appleType = type;

    // Set apple size based on type
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

    // Directly set velocity instead of using gravity
    if (!this.scene.isPaused()) {
      this.target.setVelocityY(this.currentSpeed);
      console.log("Apple spawned with velocity:", this.target.body.velocity.y);
    }
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
    // Use scene pause instead of gameState
    this.scene.pause();
    this.physics.pause();

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
      if (this.game.onScoreSubmit) {
        this.game.onScoreSubmit(this.points);
      }

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
    this.game.events.off("startGame");
  }
}

/**
 * Wrapper class for React integration
 */ class AppleCatcherGame {
  constructor(config) {
    this.config = config;
    this.game = null;
    this.scene = null; // Add this to track the scene
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
          gravity: { y: 0 },
          debug: false,
        },
      },
      scene: GameScene,
    };

    try {
      this.game = new Phaser.Game(gameConfig);
      this.game.onScoreSubmit = this.config.onScoreSubmit;

      // Wait for scene to be created
      this.game.events.once("ready", () => {
        this.scene = this.game.scene.getScene("scene-game");
        console.log("Game scene ready:", this.scene);
      });

      console.log("Game initialized successfully");
    } catch (error) {
      console.error("Failed to initialize game:", error);
    }
  }

  async startGame() {
    try {
      // Try to get scene if not already stored
      if (!this.scene) {
        this.scene = this.game.scene.getScene("scene-game");
      }

      // Wait for scene to be ready
      if (!this.scene) {
        await new Promise((resolve) => {
          const checkScene = setInterval(() => {
            this.scene = this.game.scene.getScene("scene-game");
            if (this.scene) {
              clearInterval(checkScene);
              resolve();
            }
          }, 100);
        });
      }

      console.log("Starting game with scene:", this.scene);
      this.game.events.emit("startGame");
    } catch (error) {
      console.error("Error starting game:", error);
    }
  }

  destroy() {
    if (this.game) {
      try {
        this.game.destroy(true);
        this.game = null;
        this.scene = null; // Clear scene reference
        console.log("Game destroyed successfully");
      } catch (error) {
        console.error("Error destroying game:", error);
      }
    }
  }
}
// Make available globally
window.AppleCatcherGame = AppleCatcherGame;
