import { useDispatch } from "react-redux";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../utils/firebase";
import { addUser } from "../redux/slice/userSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";

export const useGoogleAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result?.user;
      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "",
      };
      if (!user) {
        toast.error("User authentication failed. Please try again.");
        return;
      }
      const isNewUser = result?._tokenResponse?.isNewUser ?? false;
      const idToken = await user.getIdToken();
      console.log("result==", result);
      console.log("token==", idToken);
      console.log("user==", user);
      console.log("isNewUser==", isNewUser);
      if (!idToken) {
        toast.error("Unable to retrieve access token.");
        return;
      }
      //  Store the access token and refresh

      if (isNewUser) {
        dispatch(addUser(userData));
      } else {
        try {
          const { data } = await axiosInstance.get("/users/me");
          console.log(data, "==response.data");
          dispatch(addUser(data));
        } catch (error) {
          console.warn("No DB record, falling back to Firebase data.", error);
          dispatch(addUser(userData));
        }
      }

      toast.success(
        isNewUser ? "Google signup successful!" : "Google login successful!"
      );
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Google auth failed:", error);

      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Login popup closed before completing sign-in.");
      } else if (error.code === "auth/popup-blocked") {
        toast.error("Popup was blocked by the browser. Please allow popups.");
      } else {
        toast.error(error?.message || "Google authentication failed.");
      }
    }
  };

  return { authWithGoogle };
};
