import { Outlet } from "react-router-dom";
import { HeaderPrivate } from "../pages/Dashboard/components/Header/Header";
import { useAuthWatcher } from "../utils/AuthWatcher";
import CompleteProfileModal from "../pages/Dashboard/components/CompleteProfileModal/CompleteProfileModal";
import { useState } from "react";

export const PrivateLayout = () => {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  useAuthWatcher(setProfileModalOpen);

  return (
    <>
      <HeaderPrivate />
      <Outlet />
      <CompleteProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </>
  );
};
