import { Routes, Route } from "react-router-dom";
import { Login } from "../pages/Auth/Login";
import { Signup } from "../pages/Auth/Signup";
import { Home } from "../pages/LandingPage/Home";
import { MainLayout } from "../layouts/MainLayout";
import { PrivateRoutes } from "./PrivateRoutes";
import { PrivateLayout } from "../layouts/PrivateLayout";
import { Dashboard } from "../pages/PrivatePages/Dashboard";
import { Profile } from "../pages/PrivatePages/Profile";
import { NotFound } from "../pages/NotFound";
import { VerifyPage } from "../pages/Auth/VerifyPage";
import { Logs } from "../pages/PrivatePages/Logs";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes with shared MainLayout */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/verify" element={<VerifyPage />} />
      </Route>

      {/* Protected Routes with DashboardLayout */}
      <Route element={<PrivateRoutes />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
