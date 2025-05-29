import { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from "../../utils/firebase";
import toast from "react-hot-toast";

export const PasswordlessEmailForm = ({ title = "Continue with Email" }) => {
  const [email, setEmail] = useState("");
  const redirectUrl = import.meta.env.VITE_FIREBASE_EMAIL_LINK_REDIRECT;
  const handleMagicLinkLogin = async (e) => {
    e.preventDefault();
    try {
      const actionCodeSettings = {
        url: redirectUrl,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem("emailForSignIn", email);
      toast.success("Magic link sent to your email.");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <form onSubmit={handleMagicLinkLogin}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "black",
            color: "white",
            "&:hover": {
              backgroundColor: "#333",
            },
          }}
        >
          Send Magic Link
        </Button>
      </form>
    </>
  );
};
