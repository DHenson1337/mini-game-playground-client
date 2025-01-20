# Mini Game Playground - Frontend

A React-based gaming platform featuring classic games with modern styling and real-time features.

## Features

- 🎮 Multiple Classic Games
  - Tetris
  - Tic Tac Toe
  - Snake
- 🏆 Real-time Leaderboards
- 🎵 Dynamic Sound System
- 🔐 User Authentication
- 👤 Guest Access
- 💾 Score Persistence
- 🎨 Modern UI with Glassmorphism Design

## Tech Stack

- React 18
- Socket.IO Client
- Framer Motion
- React Router
- Zustand (State Management)

## Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher

## Installation

1. Clone the repository:

   ```bash
   git clone [your-repo-url]
   cd mini-game-playground-client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a .env file:

   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `VITE_BACKEND_URL`: URL of the backend server

## Project Structure

```
src/
├── components/
│   ├── games/         # Game components
│   ├── layout/        # Layout components
│   └── ui/           # Reusable UI components
├── context/          # React context providers
├── pages/           # Page components
├── services/        # API and service logic
├── styles/          # Global styles
└── utils/          # Utility functions
```

## Game Integration

To add a new game:

1. Create game component in `src/components/games/`
2. Add game data to backend initialization
3. Update game selection page
4. Add score handling
5. Update leaderboard compatibility

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## Features in Development

- Achievement System
- Profile Customization
- Additional Games
- Multiplayer Support

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

[Pending...]

## Credits

See CREDITS.md for full attribution of assets and libraries used.
