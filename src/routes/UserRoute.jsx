import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const UserRoute = ({ children }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return user && role === "user" ? children : <Navigate to="/login" />;
};

export default UserRoute;
