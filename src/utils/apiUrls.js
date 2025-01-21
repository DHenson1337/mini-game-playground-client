// const BASE_URL = "http://localhost:5000/api";
// const BASE_URL = "https://mini-game-playground-server.onrender.com/api";

const BASE_URL = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : "http://localhost:5000/api";

const API_URLS = {
  GAMES: `${BASE_URL}/games`,
  USERS: `${BASE_URL}/users`,
  SCORES: `${BASE_URL}/scores`,
  AUTH: `${BASE_URL}/auth`,
};

// Export individual endpoints for easier access
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_URLS.AUTH}/login`,
  SIGNUP: `${API_URLS.AUTH}/signup`,
  GUEST: `${API_URLS.AUTH}/guest`,
  LOGOUT: `${API_URLS.AUTH}/logout`,
  CHECK: `${API_URLS.AUTH}/check`,
  REFRESH: `${API_URLS.AUTH}/refresh-token`,
};

export default API_URLS;
