import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import "../../pages/Auth/auth.css"

export const GoogleButton = () => {
      const { authWithGoogle } = useGoogleAuth();
  return (
    <a className="google-btn" onClick={authWithGoogle}>
      <img
        src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw"
        alt="Google"
      />
      Continue with Google
    </a>
  );
};
