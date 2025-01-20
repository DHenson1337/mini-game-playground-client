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
import PageMusic from "./components/PageMusic";
import BackgroundEffects from "./components/BackgroundEffects";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./components/PageTransition";
import GameTransition from "./components/GameTransition";
// import TestAuth from "./TestAuth"; For testing
// import TestLogin from "./TestLogin"; //Temp for Testing

function App() {
  return (
    <UserProvider>
      <SoundProvider>
        <BackgroundEffects />
        <PageMusic />
        <AnimatePresence>
          <Routes>
            {/* Landing page is separate from main layout */}
            <Route
              path="/"
              element={
                <PageTransition>
                  <LandingPage />
                </PageTransition>
              }
            />

            {/* For testing */}
            {/* <Route path="/test" element={<TestLogin />} /> */}
            {/* <Route path="/test" element={<TestAuth />} /> */}

            {/* All other pages are protected */}
            {/* Route for Game Selection page */}
            <Route element={<Layout />}>
              <Route
                path="/games"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <GameSelection />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />

              {/* Route for Games */}
              <Route
                path="/games/:gameId"
                element={
                  <ProtectedRoute>
                    <GameTransition>
                      <GameView />
                    </GameTransition>
                  </ProtectedRoute>
                }
              />
              {/* Route for leaderboard page */}
              <Route
                path="/leaderboard"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <Leaderboard />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />

              {/* Route for Profile page settings */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <PageTransition>
                      <ProfilePage />
                    </PageTransition>
                  </ProtectedRoute>
                }
              />

              {/* Catch any unknown routes */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </SoundProvider>
    </UserProvider>
  );
}

export default App;
