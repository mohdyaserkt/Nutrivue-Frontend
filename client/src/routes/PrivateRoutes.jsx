import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
export const PrivateRoutes = () => {
    const user = useSelector((state) => state?.user);
    // If no user info or email, redirect to login
  const isAuthenticated = !!user && !!user.email;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
