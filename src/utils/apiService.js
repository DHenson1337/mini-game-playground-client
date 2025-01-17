import API_URLS from "./apiUrls";

const REQUEST_TIMEOUT = 1000;
let lastRequestTime = 0;
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Enhanced error handler for API responses
 * @param {Response} response - Fetch API response object
 * @returns {Promise} - Returns the response if OK, throws detailed error if not
 */
const handleApiError = async (response) => {
  if (!response.ok) {
    // Try to get detailed error message from response
    const errorData = await response.json().catch(() => ({
      message: "An unknown error occurred",
    }));

    // Create detailed error object
    const error = new Error(errorData.message || "Request failed");
    error.status = response.status;
    error.statusText = response.statusText;
    error.data = errorData;

    throw error;
  }
  return response;
};

/**
 * Throttled fetch implementation with timeout
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 * @returns {Promise} - Fetch promise
 */
const throttledFetch = async (url, options = {}) => {
  const now = Date.now();
  const timeToWait = Math.max(0, REQUEST_TIMEOUT - (now - lastRequestTime));

  if (timeToWait > 0) {
    await new Promise((resolve) => setTimeout(resolve, timeToWait));
  }

  lastRequestTime = Date.now();

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    return await handleApiError(response);
  } catch (error) {
    // Add request details to error
    error.url = url;
    error.timestamp = new Date().toISOString();
    console.error("API Request Failed:", {
      url,
      timestamp: error.timestamp,
      error: error.message,
    });
    throw error;
  }
};

/**
 * Cache management functions
 */
export const cacheManager = {
  get: (key) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    return null;
  },
  set: (key, data) => {
    cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  },
  invalidate: (key) => {
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  },
};

export const apiService = {
  /**
   * Fetches all games with error handling and caching
   */
  fetchGames: async () => {
    const cached = cacheManager.get("games");
    if (cached) return cached;

    try {
      const response = await throttledFetch(API_URLS.GAMES);
      const data = await response.json();
      cacheManager.set("games", data);
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch games: ${error.message}`);
    }
  },

  /**
   * Fetches a specific game by ID
   * @param {string} gameId - Unique game identifier
   */
  fetchGame: async (gameId) => {
    const cacheKey = `game-${gameId}`;
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await throttledFetch(`${API_URLS.GAMES}/${gameId}`);
      const data = await response.json();
      cacheManager.set(cacheKey, data);
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch game ${gameId}: ${error.message}`);
    }
  },

  /**
   * Submits a score with retry logic
   * @param {Object} scoreData - Score data to submit
   * @param {number} maxRetries - Maximum number of retry attempts
   */
  submitScore: async (scoreData, maxRetries = 3) => {
    if (
      !scoreData.username ||
      !scoreData.gameId ||
      scoreData.score === undefined
    ) {
      throw new Error("Missing required score data");
    }

    console.log("Submitting score with data:", scoreData);
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(API_URLS.SCORES, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(scoreData),
        });

        await handleApiError(response);
        const data = await response.json();
        console.log("Score submission successful:", data);
        return data;
      } catch (error) {
        console.error(`Attempt ${attempt} failed:`, error);
        lastError = error;

        if (attempt === maxRetries) {
          throw new Error(
            `Failed to submit score after ${maxRetries} attempts: ${error.message}`
          );
        }

        // Wait before retrying (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt - 1))
        );
      }
    }
  },

  /**
   * Fetches leaderboard data with cache management
   * @param {string} gameId - Game identifier
   */
  fetchLeaderboard: async (gameId) => {
    const cacheKey = `leaderboard-${gameId}`;
    const cached = cacheManager.get(cacheKey);
    if (cached) return cached;

    try {
      const response = await throttledFetch(
        `${API_URLS.SCORES}/game/${gameId}`
      );
      const data = await response.json();
      cacheManager.set(cacheKey, data);
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch leaderboard: ${error.message}`);
    }
  },
};
