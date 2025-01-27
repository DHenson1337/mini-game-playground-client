# Mini Game Playground - Frontend

A modern web-based gaming platform featuring classic games with MMO-style UI, real-time leaderboards, and user authentication.

## 🎮 Features

- **Classic Games Collection**
  - Tetris with score tracking
  - Tic Tac Toe with AI opponent
  - Snake with customizable gameplay
- **Modern Interface**
  - MMO-inspired design
  - Pixel font styling
  - Glassmorphism effects
  - Smooth page transitions
- **User System**
  - Secure authentication
  - Guest play support
  - Profile customization
  - Avatar selection
- **Real-time Features**
  - Live leaderboards
  - Score tracking
  - User presence
- **Sound System**
  - Game-specific background music
  - Interactive sound effects
  - Volume controls
  - Sound preferences persistence

## 🛠️ Tech Stack

- **Core**
  - React 18
  - Vite
  - React Router v7
- **State & Real-time**
  - Socket.IO Client
  - Zustand
- **Styling & Animation**
  - Custom CSS (No frameworks)
  - Framer Motion
  - Press Start 2P Font

## 📋 Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher
- Modern web browser with WebSocket support

## 🚀 Getting Started

1. **Clone the repository:**

   ```bash
   git clone [your-repo-url]
   cd mini-game-playground-client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment:**
   Create a `.env` file:

   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. **Start development server:**

   ```bash
   npm run dev
   ```

5. **Access the application:**
   Open [http://localhost:5173](http://localhost:5173) in your browser

## 🔧 Configuration

### Environment Variables

| Variable           | Description        | Default                 |
| ------------------ | ------------------ | ----------------------- |
| `VITE_BACKEND_URL` | Backend server URL | `http://localhost:5000` |

## 📁 Project Structure

```
src/
├── assets/          # Static assets (images, sounds)
│   ├── avatars/
│   ├── sounds/
│   └── logos/
├── components/      # Reusable components
│   ├── games/      # Game implementations
│   ├── layout/     # Layout components
│   └── ui/         # UI components
├── context/        # React contexts
├── pages/          # Page components
├── services/       # API services
├── styles/         # Global styles
└── utils/         # Utility functions
```

## 🎮 Games

### Currently Available

1. **Tetris**

   - Classic block-stacking gameplay
   - Score multipliers
   - Level progression

2. **Tic Tac Toe**

   - AI opponent
   - Multiple difficulty levels
   - Score tracking

3. **Snake**
   - Classic snake gameplay
   - Edge wrapping option
   - Progressive difficulty

### Adding New Games

1. Create game component in `src/components/games/`
2. Implement score tracking
3. Add to game selection page
4. Configure leaderboard support
5. Add sound effects and music

## 📝 Available Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

## 🔜 Roadmap

- [ ] Achievement system
- [ ] Additional games
- [ ] Multiplayer support
- [ ] Friend system
- [ ] Mobile responsiveness
- [ ] Dark/Light theme toggle

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

[Your License] - See LICENSE.md for details

## 👏 Credits

See [CREDITS.md](./CREDITS.md) for full attribution of assets and libraries used.

## 🔗 Related Repositories

- [Backend Repository](https://github.com/DHenson1337/mini-game-playground-server)
- [Live Demo](https://mini-game-playground.netlify.app/)
