// components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router";
import { useUser } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Todo: Add a loading component :)
  }

  if (!user) {
    // Save the attempted url for redirecting after login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
