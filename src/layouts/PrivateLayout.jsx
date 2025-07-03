import { Outlet } from "react-router-dom";
import { Header } from "../components/PublicLayout/Header";

export const PrivateLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
