import { Outlet } from "react-router-dom";
import { Navbar } from "../components/PrivateLayout/Navbar";

export const PrivateLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
