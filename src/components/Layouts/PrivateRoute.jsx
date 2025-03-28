import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; 

const PrivateRoute = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Don't redirect while loading (you can add a loader here)
  }

  return user ? element : <Navigate to="/" replace />;
};

export default PrivateRoute;
