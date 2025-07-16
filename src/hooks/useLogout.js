import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { clearUser } from "../redux/slice/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

export const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast("Logout Successfully");
      navigate("/login");
      dispatch(clearUser());
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return { handleLogout };
};
