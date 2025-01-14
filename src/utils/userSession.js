//For saving user Session to local storage

const USER_KEY = "mgp_user"; // mgp = mini game playground

export const saveUserToSession = (userData) => {
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
};

export const getUserFromSession = () => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

//The Logout button (For good :>)
export const removeUserFromSession = () => {
  localStorage.removeItem(USER_KEY);
};

//Checks if user is loggedin
export const isUserLoggedIn = () => {
  return !!getUserFromSession();
};
