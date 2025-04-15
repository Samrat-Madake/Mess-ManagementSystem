import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RedirectBasedOnRole() {
  const { user, role, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" />;

  return role === "admin" ? <Navigate to="/admin" /> : <Navigate to="/user" />;
}
