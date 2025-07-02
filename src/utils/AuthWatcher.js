import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { addUser, clearUser, setAuthLoading } from "../redux/slice/userSlice";
import { axiosInstance } from "./axiosInstance";

export const AuthWatcher = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth();
    dispatch(setAuthLoading(true));

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const response = await axiosInstance.get("/users/me", {
            headers: { Authorization: `Bearer ${idToken}` },
          });

          dispatch(addUser(response.data));
        } catch (error) {
          console.error("Failed to fetch user details:", error);
          dispatch(clearUser());
        }
      } else {
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return null;
};
