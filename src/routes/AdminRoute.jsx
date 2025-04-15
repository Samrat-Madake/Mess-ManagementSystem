import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { user, role, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  return user && role === "admin" ? children : <Navigate to="/login" />;
};

export default AdminRoute;
