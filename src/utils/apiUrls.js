//My BackEnd API PULLS

const API_URLS = {
  GAMES: "http://localhost:5000/api/games",
  USERS: "http://localhost:5000/api/users",
  SCORES: "http://localhost:5000/api/scores",

  //Todo
  // Individual score endpoints :
  // - ${API_URLS.SCORES}/game/:gameId (for game leaderboard)
  // - ${API_URLS.SCORES}/user/:username (for user scores)
};

export default API_URLS;
