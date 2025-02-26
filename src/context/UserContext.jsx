// context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import {
  getUserFromSession,
  saveUserToSession,
  removeUserFromSession,
} from "../utils/userSession";
import Loading from "../components/Loading";

const UserContext = createContext(null);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to check authentication status and restore user session
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        setLoading(true);
        const sessionUser = getUserFromSession();

        if (sessionUser) {
          const isAuthenticated = await authService.checkAuth();

          if (isAuthenticated && mounted) {
            setUser(sessionUser);
          } else {
            const refreshed = await authService.refreshToken();
            if (refreshed && mounted) {
              const recheck = await authService.checkAuth();
              if (recheck) {
                setUser(recheck.user);
                saveUserToSession(recheck.user);
              } else {
                removeUserFromSession();
                setUser(null);
              }
            }
          }
        } else {
          const refreshed = await authService.refreshToken();
          if (refreshed && mounted) {
            const authCheck = await authService.checkAuth();
            if (authCheck) {
              setUser(authCheck.user);
              saveUserToSession(authCheck.user);
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        if (mounted) {
          setError(error.message);
          setUser(null);
          removeUserFromSession();
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Token refresh interval
  useEffect(() => {
    if (!user) return;

    const refreshInterval = setInterval(async () => {
      try {
        await authService.refreshToken();
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    }, 14 * 60 * 1000); // Refresh every 14 minutes

    return () => clearInterval(refreshInterval);
  }, [user]);

  const login = async (userData) => {
    setUser(userData);
    saveUserToSession(userData);
  };

  const logout = async () => {
    try {
      await authService.logout();
      removeUserFromSession();
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  // Add updateUser function
  const updateUser = async (updatedUserData) => {
    try {
      // Update the user state
      setUser(updatedUserData);
      // Update the session storage
      saveUserToSession(updatedUserData);
      return true;
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUser, // Add updateUser to the context value
  };

  if (loading) {
    return <Loading size="large" fullscreen message="Initializing..." />;
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContext;
