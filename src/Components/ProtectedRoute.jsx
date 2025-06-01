import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Contexts/UserContext";

const ProtectedRoute = ({ element, requireAdmin = false }) => {
  const { user } = useContext(UserContext);

  // If the route requires admin and user is not an admin, redirect to 404 or home
  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="*" replace />;
  }

  // If the route requires authentication and user is not logged in, redirect to signin
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Render the protected component
  return element;
};

export default ProtectedRoute;
