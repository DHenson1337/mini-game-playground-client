import API_URLS from "./apiUrls";

const REQUEST_TIMEOUT = 1000;
let lastRequestTime = 0;
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const throttledFetch = async (url, options = {}) => {
  const now = Date.now();
  const timeToWait = Math.max(0, REQUEST_TIMEOUT - (now - lastRequestTime));

  if (timeToWait > 0) {
    await new Promise((resolve) => setTimeout(resolve, timeToWait));
  }

  lastRequestTime = Date.now();
  return fetch(url, options);
};

export const apiService = {
  fetchGames: async () => {
    // Check cache first
    const cachedData = cache.get("games");
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }

    const response = await throttledFetch(API_URLS.GAMES);
    if (!response.ok) throw new Error("Failed to fetch games");
    const data = await response.json();

    // Cache the response
    cache.set("games", {
      data,
      timestamp: Date.now(),
    });

    return data;
  },

  fetchGame: async (gameId) => {
    // Check cache first
    const cacheKey = `game-${gameId}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }

    const response = await throttledFetch(`${API_URLS.GAMES}/${gameId}`);
    if (!response.ok) throw new Error("Game not found");
    const data = await response.json();

    // Cache the response
    cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data;
  },

  submitScore: async (scoreData) => {
    const response = await throttledFetch(API_URLS.SCORES, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(scoreData),
    });
    if (!response.ok) throw new Error("Failed to submit score");
    return response.json();
  },
};
