// App.jsx
import { Routes, Route } from "react-router";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import LandingPage from "./pages/LandingPage";
import GameSelection from "./pages/GameSelection";
import GameView from "./pages/GameView";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";
import { SoundProvider } from "./context/SoundContext";
// import TestAuth from "./TestAuth"; For testing
// import TestLogin from "./TestLogin"; //Temp for Testing

function App() {
  return (
    <UserProvider>
      <SoundProvider>
        <Routes>
          {/* Landing page is separate from main layout */}
          <Route path="/" element={<LandingPage />} />

          {/* For testing */}
          {/* <Route path="/test" element={<TestLogin />} /> */}
          {/* <Route path="/test" element={<TestAuth />} /> */}

          {/* All other pages are protected */}
          <Route element={<Layout />}>
            <Route
              path="/games"
              element={
                <ProtectedRoute>
                  <GameSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/games/:gameId"
              element={
                <ProtectedRoute>
                  <GameView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Catch any unknown routes */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </SoundProvider>
    </UserProvider>
  );
}

export default App;
