import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebase";
import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/slice/userSlice";
import axios from "axios";
import { Box, Container, Paper, Typography } from "@mui/material";

export const VerifyPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Verifying...");
  const dispatch = useDispatch();

  useEffect(() => {
    const email = localStorage.getItem("emailForSignIn");

    if (isSignInWithEmailLink(auth, window.location.href) && email) {
      signInWithEmailLink(auth, email, window.location.href)
        .then(async (result) => {
          const user = result.user;
          const isNewUser = result._tokenResponse?.isNewUser;

          const idToken = await user.getIdToken();
          localStorage.setItem("accessToken", idToken);

          dispatch(
            addUser({
              uid: user.uid,
              email: user.email,
              name: user.displayName || "",
            })
          );

          localStorage.removeItem("emailForSignIn");
          toast.success(isNewUser ? "Account created!" : "Welcome back!");

          setStatus("done");

          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        })
        .catch((err) => {
          toast.error(err.message);
          setStatus("error");
        });
    } else {
      setStatus("error");
    }
  }, [navigate, dispatch]);

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          {status === "verifying" ? (
            <>
              <Skeleton
                variant="text"
                width="60%"
                height={40}
                sx={{ mx: "auto" }}
              />
              <Skeleton
                variant="text"
                width="40%"
                height={30}
                sx={{ mx: "auto", mt: 2 }}
              />
              <Skeleton variant="rectangular" height={200} sx={{ mt: 3 }} />
            </>
          ) : (
            <Typography
              variant="h6"
              color={status === "error" ? "error" : "success"}
            >
              {status === "error"
                ? "Verification failed or link is invalid."
                : "Verified successfully!"}
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};
