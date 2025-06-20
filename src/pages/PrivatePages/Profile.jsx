import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Grid,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import WcIcon from "@mui/icons-material/Wc";
import HeightIcon from "@mui/icons-material/Height";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { axiosInstance } from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/slice/userSlice";
import toast from "react-hot-toast";

// Dropdown options
const genders = ["male", "female", "other"];
const activityLevels = ["sedentary", "light", "moderate", "active", "extra"];
const goals = ["lose", "maintain", "gain", "custom"];

export const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const userDetails = useSelector((state) => state?.user);
  const [user, setUser] = useState(userDetails);
  const dispatch = useDispatch();
  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = { ...user };

      if (payload.goal === "custom") {
        delete payload.target_calories;
      } else {
        // Only send target_calories
        delete payload.customCalorie;
        delete payload.target_calories;
      }
      const { data } = await axiosInstance.post("/users/save-user", payload);
      console.log("data====", data);
      dispatch(updateUser(data));
      setUser(data);
      toast.success("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 6, px: 2 }}>
      <Card elevation={4} sx={{ borderRadius: 4 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              mb: 3,
            }}
          >
            <Avatar
              sx={{ width: 90, height: 90, bgcolor: "primary.main", mb: 1 }}
            >
              <PersonIcon fontSize="large" />
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              {user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Profile Overview
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={2}>
            <ProfileField
              icon={<EmailIcon />}
              label="Email"
              value={user.email}
              editable={false}
            />
            <ProfileField
              icon={<BadgeIcon />}
              label="Age"
              value={user.age}
              editable={editMode}
              onChange={(v) => handleChange("age", v)}
            />
            <ProfileField
              icon={<WcIcon />}
              label="Gender"
              value={user.gender}
              editable={editMode}
              options={genders}
              onChange={(v) => handleChange("gender", v)}
            />
            <ProfileField
              icon={<FitnessCenterIcon />}
              label="Weight"
              value={user.weight_kg}
              editable={editMode}
              onChange={(v) => handleChange("weight_kg", v)}
            />
            <ProfileField
              icon={<HeightIcon />}
              label="Height"
              value={user.height_cm}
              editable={editMode}
              onChange={(v) => handleChange("height_cm", v)}
            />
            <ProfileField
              icon={<HeightIcon />}
              label="Activity Level"
              value={user.activity_level}
              editable={editMode}
              options={activityLevels}
              onChange={(v) => handleChange("activity_level", v)}
            />
            <ProfileField
              icon={<HeightIcon />}
              label="Goal"
              value={user.goal}
              editable={editMode}
              options={goals}
              onChange={(v) => handleChange("goal", v)}
            />
            {user.goal === "custom" ? (
              <ProfileField
                icon={<HeightIcon />}
                label="Target Calorie"
                value={user.customCalorie}
                editable={editMode}
                onChange={(v) => handleChange("customCalorie", v)}
              />
            ) : (
              <ProfileField
                icon={<HeightIcon />}
                label="Target Calorie"
                value={user.target_calories}
                editable={editMode}
                onChange={(v) => handleChange("target_calories", v)}
              />
            )}
          </Grid>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            {editMode ? (
              <>
                <Button
                  variant="outlined"
                  sx={{ mr: 2 }}
                  onClick={() => {
                    setUser(userDetails);
                    setEditMode(false);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={() => setEditMode(true)}>
                Edit Profile
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

// Reusable field component with dropdown support
const ProfileField = ({
  icon,
  label,
  value,
  editable = false,
  onChange,
  options = [],
}) => (
  <Grid item xs={12} sm={6}>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
        p: 1.5,
      }}
    >
      <Box sx={{ color: "text.secondary", mr: 2 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        {editable ? (
          options.length > 0 ? (
            <TextField
              select
              variant="standard"
              fullWidth
              value={value}
              onChange={(e) => onChange(e.target.value)}
            >
              {options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              variant="standard"
              fullWidth
              type={typeof value === "number" ? "number" : "text"}
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          )
        ) : (
          <Typography variant="body1" fontWeight={500}>
            {value}
          </Typography>
        )}
      </Box>
    </Box>
  </Grid>
);
