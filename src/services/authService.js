// services/authService.js

import { AUTH_ENDPOINTS } from "../utils/apiUrls";

class AuthService {
  async login(username, password, rememberMe = false) {
    const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password, rememberMe }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return await response.json();
  }

  async signup(userData) {
    const response = await fetch(AUTH_ENDPOINTS.SIGNUP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }

    return await response.json();
  }

  async guestLogin(avatar = "cowled") {
    const response = await fetch(AUTH_ENDPOINTS.GUEST, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ avatar }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Guest access failed");
    }

    return await response.json();
  }

  async logout() {
    const response = await fetch(AUTH_ENDPOINTS.LOGOUT, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Logout failed");
    }

    return true;
  }

  async checkAuth() {
    try {
      const response = await fetch(AUTH_ENDPOINTS.CHECK, {
        credentials: "include",
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.authenticated;
    } catch (error) {
      console.error("Auth check failed:", error);
      return false;
    }
  }

  async refreshToken() {
    try {
      const response = await fetch(AUTH_ENDPOINTS.REFRESH, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }
}

const authService = new AuthService();
export default authService;
