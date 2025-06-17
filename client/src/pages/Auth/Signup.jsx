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
  MenuItem,
  Grid,
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
import { GoogleButton } from "../../components/PrivateLayout/GoogleButton";
export const Signup = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    weight_kg: "",
    height_cm: "",
    activity_level: "",
    goal: "",
    customCalorie: "",
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
      console.log("userCredential=", userCredential);
      const firebaseUser = userCredential.user;
      const idToken = await firebaseUser.getIdToken();

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/save-user`,
        {
          name: form.username,
          email: form.email,
          age: form.age,
          gender: form.gender,
          weight_kg: form.weight_kg,
          height_cm: form.height_cm,
          activity_level: form.activity_level,
          goal: form.goal,
          ...(form.goal === "custom" && { customCalorie: form.customCalorie }),
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("data====", data);
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
        <Paper elevation={3} sx={{ p: 4, maxWidth: "1200px", mx: "auto" }}>
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
                <GoogleButton />

                <Divider sx={{ my: 1 }}>
                  <Typography variant="body2" sx={{ color: "gray" }}>
                    or
                  </Typography>
                </Divider>

                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Create Your Account
                </Typography>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Username"
                        name="username"
                        fullWidth
                        required
                        value={form.username}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        required
                        value={form.email}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Password"
                        name="password"
                        type="password"
                        fullWidth
                        required
                        value={form.password}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        fullWidth
                        required
                        value={form.confirmPassword}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Age"
                        name="age"
                        fullWidth
                        required
                        value={form.age}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label="Gender"
                        name="gender"
                        fullWidth
                        required
                        value={form.gender}
                        onChange={handleChange}
                      >
                        {["male", "female", "other"].map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Weight (kg)"
                        name="weight_kg"
                        type="number"
                        fullWidth
                        required
                        value={form.weight_kg}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Height (cm)"
                        name="height_cm"
                        type="number"
                        fullWidth
                        required
                        value={form.height_cm}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label="Activity Level"
                        name="activity_level"
                        fullWidth
                        required
                        value={form.activity_level}
                        onChange={handleChange}
                      >
                        {[
                          "sedentary",
                          "light",
                          "moderate",
                          "active",
                          "extra",
                        ].map((level) => (
                          <MenuItem key={level} value={level}>
                            {level}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        select
                        label="Goal"
                        name="goal"
                        fullWidth
                        required
                        value={form.goal}
                        onChange={handleChange}
                      >
                        {["lose", "maintain", "gain", "custom"].map((goal) => (
                          <MenuItem key={goal} value={goal}>
                            {goal}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    {form.goal === "custom" && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Custom Calorie"
                          name="customCalorie"
                          type="number"
                          fullWidth
                          required
                          value={form.customCalorie}
                          onChange={handleChange}
                        />
                      </Grid>
                    )}
                  </Grid>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 3,
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
