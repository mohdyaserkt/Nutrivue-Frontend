import { Outlet } from "react-router-dom";
import {HeaderPrivate } from "../components/PrivateLayout/Header/Header";

export const PrivateLayout = () => {
  return (
    <>
      <HeaderPrivate />
      <Outlet />
    </>
  );
};
