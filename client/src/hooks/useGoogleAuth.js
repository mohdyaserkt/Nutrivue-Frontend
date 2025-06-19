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
      if (!user) {
        toast.error("User authentication failed. Please try again.");
        return;
      }
      const isNewUser = result?._tokenResponse?.isNewUser ?? false;
      const refreshToken = user.refreshToken;
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
      localStorage.setItem("accessToken", idToken);
      localStorage.setItem("refreshToken", refreshToken);

      if (isNewUser) {
        try {
          dispatch(
            addUser({
              uid: user.uid,
              email: user.email,
              name: user.displayName,
            })
          );
        } catch (error) {
          console.log(error);
          toast.error(error.message);
          return;
        }
      } else {
        try {
          const { data } = await axiosInstance.get("/users/me");
          console.log(data, "==response.data");

          if (data) {
            dispatch(addUser(data));
          }
        } catch (error) {
          if (error.response.status === 404) {
            dispatch(
              addUser({
                uid: user.uid,
                email: user.email,
                name: user.displayName,
              })
            );
          } else {
            console.error("Fetch user failed:", error);
            console.error("status", error.response.status);
            toast.error("Failed to fetch user data.");
            return;
          }
        }
      }

      navigate("/dashboard");

      toast.success(
        isNewUser ? "Google signup successful!" : "Google login successful!"
      );
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
