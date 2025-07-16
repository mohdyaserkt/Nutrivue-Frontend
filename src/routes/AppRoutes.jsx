import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/LandingPage/Home";
import { MainLayout } from "../layouts/MainLayout";
import { PrivateRoutes } from "./PrivateRoutes";
import { PrivateLayout } from "../layouts/PrivateLayout";
import { Profile } from "../pages/PrivatePages/Profile";
import { NotFound } from "../pages/NotFound";
import { VerifyPage } from "../pages/Auth/VerifyPage";
// import { Logs } from "../pages/PrivatePages/Logs";
import NewDashboard from "../pages/Dashboard/Dashboard";
import { AuthPage } from "../pages/Auth/AuthPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes with shared MainLayout */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/verify" element={<VerifyPage />} />
      </Route>

      {/* Protected Routes with DashboardLayout */}
      <Route element={<PrivateRoutes />}>
        <Route element={<PrivateLayout />}>
          <Route path="/dashboard" element={<NewDashboard />} />
          {/* <Route path="/logs" element={<Logs />} /> */}
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
