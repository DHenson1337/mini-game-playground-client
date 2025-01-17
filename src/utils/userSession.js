//For saving user Session to local storage

const USER_KEY = "mgp_user"; // mgp = mini game playground

export const saveUserToSession = (userData) => {
  console.log("Saving user to session:", userData);
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

export const getUserFromSession = () => {
  const data = localStorage.getItem(USER_KEY);
  const userData = data ? JSON.parse(data) : null;
  console.log("Retrieved user from session:", userData);
  return userData;
};

export const removeUserFromSession = () => {
  console.log("Removing user from session");
  localStorage.removeItem(USER_KEY);
};

export const isUserLoggedIn = () => {
  const isLoggedIn = !!getUserFromSession();
  console.log("User logged in status:", isLoggedIn);
  return isLoggedIn;
};
