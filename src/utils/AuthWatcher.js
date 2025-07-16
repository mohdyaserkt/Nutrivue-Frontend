import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { axiosInstance } from "./axiosInstance";
import { addUser, clearUser } from "../redux/slice/userSlice";

export const useAuthWatcher = (setProfileModalOpen) => {
  const dispatch = useDispatch();
  console.log(
    "userDetails====",
    useSelector((state) => state?.user?.user)
  );
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        // signed out
        dispatch(clearUser());
        setProfileModalOpen(false);
        return;
      }

      try {
        console.log("in auth watch component===");
        const { data } = await axiosInstance.get("/users/me");
        dispatch(addUser(data));
        setProfileModalOpen(false);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        const status = error?.response?.status;
        const detail = error?.response?.data?.detail;

        if (
          status === 404 &&
          detail === "Profile not found. Please create your profile first."
        ) {
          setProfileModalOpen(true);
        } else {
          console.error("Failed to fetch user details:", error);
          // Other errors: treat as “need profile”
          dispatch(clearUser());
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch]);
};
