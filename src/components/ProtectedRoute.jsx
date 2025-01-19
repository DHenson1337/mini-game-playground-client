// components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router";
import { useUser } from "../context/UserContext";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return <Loading size="default" message="Authenticating..." />;
  }

  if (!user) {
    // Save the attempted url for redirecting after login
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
