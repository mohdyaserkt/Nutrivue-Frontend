import { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../utils/firebase";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/slice/userSlice";
import GoogleIcon from "@mui/icons-material/Google";
import { PasswordlessEmailForm } from "../../components/PrivateLayout/PasswordlessEmailForm";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { axiosInstance } from "../../utils/axiosInstance";
import { GoogleButton } from "../../components/PrivateLayout/GoogleButton";
export const Login = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authWithGoogle } = useGoogleAuth();

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
    setEmail("");
    setPassword("");
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      console.log("methods==", methods);
      if (methods.includes("google.com") && !methods.includes("password")) {
        toast.error(
          "This email is registered via Google. Please use Google Login."
        );
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();

      console.log("idToken==", idToken);
      localStorage.setItem("accessToken", idToken);
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
      };

      const response = await axiosInstance.get("/users/me",{
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
       });
      console.log( response.data, "==response.data");

      dispatch(addUser(response?.data));
      navigate("/dashboard");
      toast.success("Login successful!");
    } catch (err) {
      console.log("err", err);
      if (err.code === "auth/wrong-password") {
        toast.error("Incorrect password.");
      } else if (err.code === "auth/user-not-found") {
        toast.error("No user found with this email.");
      } else {
        toast.error(err.message);
      }
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Tabs value={tabIndex} onChange={handleChange} centered>
            <Tab label="Email & Password" />
            <Tab label="Magic Link" />
          </Tabs>

          <Box
            sx={{
              minHeight: { xs: "400px", sm: "450px" },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            {tabIndex === 0 && (
              <>
                <Box>
                  <GoogleButton />
                  {/* Divider with "or" */}
                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" sx={{ color: "gray" }}>
                      or
                    </Typography>
                  </Divider>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Login to Nutrivue
                  </Typography>
                  <form onSubmit={handleSubmit}>
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
                    <TextField
                      label="Password"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                      Sign In
                    </Button>
                  </form>
                </Box>
              </>
            )}

            {tabIndex === 1 && (
              <PasswordlessEmailForm title="Login with Email Link" />
            )}

            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 3, cursor: "pointer", color: "black" }}
              onClick={() => navigate("/register")}
            >
              Don&apos;t have an account? Sign Up
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
