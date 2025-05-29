import { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  getIdToken,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../utils/firebase";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/slice/userSlice";
import GoogleIcon from "@mui/icons-material/Google";
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/firebase`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("accessToken", idToken);
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || "", // Firebase doesn't set name by default for email/password
      };

      dispatch(addUser(userData));
      toast("Login successful!");
    } catch (err) {
      toast(err.message);
    }
    console.log("Email:", email);
    console.log("Password:", password);
  };
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Optional: Get ID token if sending to backend
      const idToken = await user.getIdToken();

      // Save user to Redux
      dispatch(
        addUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
        })
      );

      // Optional: Send token to FastAPI
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/firebase`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      toast.success("Google sign-in successful!");
    } catch (error) {
      toast.error(error.message);
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
          <Button
            startIcon={<GoogleIcon sx={{ color: "black" }} />}
            variant="outlined"
            fullWidth
            onClick={handleGoogleLogin}
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
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2, cursor: "pointer", color: "black" }}
            onClick={() => navigate("/register")}
          >
            Don&apos;t have an account? Sign Up
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};
