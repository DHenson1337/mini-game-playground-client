import { Routes, Route } from "react-router";
import Layout from "./components/layout/Layout";
import LandingPage from "./pages/LandingPage";
import GameSelection from "./pages/GameSelection";
import GameView from "./pages/GameView";
import Leaderboard from "./pages/Leaderboard";
import "./index.css";

function App() {
  return (
    <Routes>
      {/* Landing page is separate from main layout */}
      <Route path="/" element={<LandingPage />} />

      {/* All other pages use the main layout */}
      <Route element={<Layout />}>
        <Route path="/games" element={<GameSelection />} />
        <Route path="/games/:gameId" element={<GameView />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Route>
    </Routes>
  );
}

export default App;
