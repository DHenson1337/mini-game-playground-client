// TestAuth.jsx
import { useState } from "react";
import authService from "./services/authService";

function TestAuth() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Test signup
  const testSignup = async () => {
    try {
      setError(null);
      const response = await authService.signup({
        username: "testuser",
        password: "password123",
        avatar: "cowled",
        rememberMe: true,
      });
      setResult(response);
      console.log("Signup successful:", response);
    } catch (err) {
      setError(err.message);
      console.error("Signup failed:", err);
    }
  };

  // Test login
  const testLogin = async () => {
    try {
      setError(null);
      const response = await authService.login("testuser", "password123", true);
      setResult(response);
      console.log("Login successful:", response);
    } catch (err) {
      setError(err.message);
      console.error("Login failed:", err);
    }
  };

  // Test guest login
  const testGuestLogin = async () => {
    try {
      setError(null);
      const response = await authService.guestLogin("cowled");
      setResult(response);
      console.log("Guest login successful:", response);
    } catch (err) {
      setError(err.message);
      console.error("Guest login failed:", err);
    }
  };

  // Test auth check
  const testAuthCheck = async () => {
    try {
      setError(null);
      const isAuthenticated = await authService.checkAuth();
      setResult({ authenticated: isAuthenticated });
      console.log("Auth check result:", isAuthenticated);
    } catch (err) {
      setError(err.message);
      console.error("Auth check failed:", err);
    }
  };

  // Test logout
  const testLogout = async () => {
    try {
      setError(null);
      await authService.logout();
      setResult({ message: "Logout successful" });
      console.log("Logout successful");
    } catch (err) {
      setError(err.message);
      console.error("Logout failed:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={testSignup}>Test Signup</button>
        <button onClick={testLogin}>Test Login</button>
        <button onClick={testGuestLogin}>Test Guest Login</button>
        <button onClick={testAuthCheck}>Test Auth Check</button>
        <button onClick={testLogout}>Test Logout</button>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>Error: {error}</div>
      )}

      {result && (
        <div style={{ marginBottom: "10px" }}>
          <h3>Result:</h3>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default TestAuth;
