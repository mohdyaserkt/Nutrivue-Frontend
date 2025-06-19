import { Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";

export const GoogleButton = () => {
      const { authWithGoogle } = useGoogleAuth();
  return (
    <div>
      {" "}
      <Button
        startIcon={<GoogleIcon sx={{ color: "black" }} />}
        variant="outlined"
        fullWidth
        onClick={authWithGoogle}
        sx={{
          mb: 2,
          borderColor: "black",
          color: "black",
          "&:hover": {
            borderColor: "black",
            backgroundColor: "#f0f0f0",
          },
        }}
      >
        Continue with Google
      </Button>
    </div>
  );
};
