import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
export const PrivateRoutes = () => {
  const user = useSelector((state) => state?.user?.user);
  const authLoading = useSelector((state) => state?.user?.authLoading);
  // If no user info or email, redirect to login
  if (authLoading) return null; // Optional: Show spinner during loading

  const isAuthenticated = !!user && !!user.email;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
