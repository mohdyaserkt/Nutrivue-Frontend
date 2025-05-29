import { useDispatch } from "react-redux";
import { fetchSignInMethodsForEmail, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../utils/firebase";
import { addUser } from "../redux/slice/userSlice";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useGoogleAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
       
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const isNewUser = result._tokenResponse?.isNewUser;

      const idToken = await user.getIdToken();
         console.log("token==",idToken);
      //  Store the access token
      localStorage.setItem("accessToken", idToken);
      dispatch(
        addUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
        })
      );

      //   await axios.post(
      //     `${import.meta.env.VITE_API_BASE_URL}/auth/firebase`,
      //     {},
      //     {
      //       headers: {
      //         Authorization: `Bearer ${idToken}`,
      //       },
      //     }
      //   );
      navigate("/dashboard");

      toast.success(
        isNewUser ? "Google signup successful!" : "Google login successful!"
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  return { signInWithGoogle };
};
