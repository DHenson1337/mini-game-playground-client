import { Routes, Route } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import LandingPage from "./pages/LandingPage";
import GameSelection from "./pages/GameSelection";
import GameView from "./pages/GameView";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Landing page is separate from main layout */}
      <Route path="/" element={<LandingPage />} />

      {/* All other pages are protected */}
      <Route element={<Layout />}>
        {/*GamePage  */}
        <Route
          path="/games"
          element={
            <ProtectedRoute>
              <GameSelection />
            </ProtectedRoute>
          }
        />
        {/* Game ViewPage */}
        <Route
          path="/games/:gameId"
          element={
            <ProtectedRoute>
              <GameView />
            </ProtectedRoute>
          }
        />
        {/* Leaderboard Page */}
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        {/* Catch any unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
