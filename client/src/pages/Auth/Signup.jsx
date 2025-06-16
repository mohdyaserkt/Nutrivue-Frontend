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
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from "../../utils/firebase";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/slice/userSlice";
import GoogleIcon from "@mui/icons-material/Google";
import { PasswordlessEmailForm } from "../../components/PrivateLayout/PasswordlessEmailForm";
import { useGoogleAuth } from "../../hooks/useGoogleAuth";
import { GoogleButton } from "../../components/PrivateLayout/GoogleButton";
export const Signup = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { authWithGoogle } = useGoogleAuth();
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
      const methods = fetchSignInMethodsForEmail(auth, form?.email).then(
        (data) => console.log("🔥 data after refresh:", data)
      );

      // if (methods.includes("google.com") && !methods.includes("password")) {
      //   toast.error(
      //     "This email is already registered via Google. You can’t sign up with a password."
      //   );
      //   return;
      // }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      console.log("userCredential=", userCredential);
      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/save-user`,
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
      navigate("/dashboard");

      toast("Signup successful!");
    } catch (err) {
      console.log(err);
      toast(err.message);
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
          <Tabs
            value={tabIndex}
            onChange={(e, newValue) => setTabIndex(newValue)}
            centered
          >
            <Tab label="Standard Sign Up" />
            <Tab label="Passwordless Sign Up" />
          </Tabs>

          <Box
            sx={{
              mt: 4,
              minHeight: "480px",
              transition: "min-height 0.3s ease",
            }}
          >
            {tabIndex === 0 && (
              <>
               <GoogleButton/>

                <Divider sx={{ my: 1 }}>
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    or
                  </Typography>
                </Divider>

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
              </>
            )}

            {tabIndex === 1 && (
              <PasswordlessEmailForm title="Sign Up with Magic Link" />
            )}

            <Typography
              variant="body2"
              align="center"
              sx={{ mt: 4, cursor: "pointer", color: "black" }}
              onClick={() => navigate("/login")}
            >
              Already have an account? Sign In
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};
