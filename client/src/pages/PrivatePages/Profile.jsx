import React, { useState } from "react";
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
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import WcIcon from "@mui/icons-material/Wc";
import HeightIcon from "@mui/icons-material/Height";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { axiosInstance } from "../../utils/axiosInstance";

export const Profile = () => {
  const [editMode, setEditMode] = useState(false);
  const [user, setUser] = useState({
    email: "alice@example.com",
    username: "alice25",
    age: 25,
    gender: "Female",
    weight: "60 kg",
    height: "165 cm",
  });

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.put("/profile/update", user);
      console.log("Updated user:", response.data);
      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
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
              onChange={(v) => handleChange("gender", v)}
            />
            <ProfileField
              icon={<FitnessCenterIcon />}
              label="Weight"
              value={user.weight}
              editable={editMode}
              onChange={(v) => handleChange("weight", v)}
            />
            <ProfileField
              icon={<HeightIcon />}
              label="Height"
              value={user.height}
              editable={editMode}
              onChange={(v) => handleChange("height", v)}
            />
          </Grid>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            {editMode ? (
              <>
                <Button
                  variant="outlined"
                  sx={{ mr: 2 }}
                  onClick={() => setEditMode(false)}
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

const ProfileField = ({ icon, label, value, editable = false, onChange }) => (
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
          <TextField
            variant="standard"
            fullWidth
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <Typography variant="body1" fontWeight={500}>
            {value}
          </Typography>
        )}
      </Box>
    </Box>
  </Grid>
);
