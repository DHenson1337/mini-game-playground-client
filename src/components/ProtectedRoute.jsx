import { Navigate } from "react-router";
import { isUserLoggedIn } from "../utils/userSession";

//Responsible for hiding all pages but landing page till, conditions are met

const ProtectedRoute = ({ children }) => {
  if (!isUserLoggedIn()) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
