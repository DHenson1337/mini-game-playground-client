// TestLogin.jsx
import { useState } from "react";
import authService from "./services/authService";

function TestLogin() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={testGuestLogin}>Test Guest Login</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}

export default TestLogin;
