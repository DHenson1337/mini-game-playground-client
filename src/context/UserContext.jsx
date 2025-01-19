import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";
import {
  getUserFromSession,
  saveUserToSession,
  removeUserFromSession,
} from "../utils/userSession";
import Loading from "../components/Loading";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  // Initialize state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Effect to check authentication status and restore user session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        // First, try to get user data from session storage
        const sessionUser = getUserFromSession();

        if (sessionUser) {
          // If we have a stored user, verify their auth status with the server
          const isAuthenticated = await authService.checkAuth();

          if (isAuthenticated) {
            setUser(sessionUser);
          } else {
            // If server says not authenticated, clear stored data
            removeUserFromSession();
            setUser(null);
          }
        } else {
          // No stored user data, try to refresh token
          try {
            const refreshed = await authService.refreshToken();
            if (refreshed) {
              // If token refresh successful, fetch updated user data
              const isAuthenticated = await authService.checkAuth();
              if (isAuthenticated) {
                // Store the updated user data
                saveUserToSession(isAuthenticated.user);
                setUser(isAuthenticated.user);
              }
            }
          } catch (refreshError) {
            console.log("Token refresh failed:", refreshError);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setError(error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Handler for user login
  const login = async (userData) => {
    setUser(userData);
    saveUserToSession(userData);
  };

  // Handler for user logout
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

  // Handler for updating user data
  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    saveUserToSession(updatedUser);
  };

  // Create context value object
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUser,
  };

  // Show loading state if authentication is being checked
  if (loading) {
    return <Loading size="large" fullscreen message="Initializing..." />;
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Custom hook for using the user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export default UserContext;
