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
  createUserWithEmailAndPassword,
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
export const Signup = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
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
        name: firebaseUser.displayName || "",
      };

      dispatch(addUser(userData));
      toast("Signup successful!");
    } catch (err) {
      toast(err.message);
    }
    console.log(form);
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
            Create Your Account
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Username"
              name="username"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={form.username}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={form.password}
              onChange={handleChange}
            />
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={form.confirmPassword}
              onChange={handleChange}
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
              Sign Up
            </Button>
          </form>
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 2, cursor: "pointer", color: "black" }}
            onClick={() => navigate("/login")}
          >
            Already have an account? Sign In
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};
