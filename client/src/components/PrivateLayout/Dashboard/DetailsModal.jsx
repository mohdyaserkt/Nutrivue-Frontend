import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  MenuItem,
  Button,
  Typography,
  Grid,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../redux/slice/userSlice";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../utils/axiosInstance";

const REQUIRED_FIELDS = {
  name: "",
  age: "",
  gender: "",
  weight_kg: "",
  height_cm: "",
  activity_level: "",
  goal: "",
  customCalorie: 0,
};

const genders = ["male", "female", "other"];
const activityLevels = ["sedentary", "light", "moderate", "active", "extra"];
const goals = ["lose", "maintain", "gain", "custom"];

export const DetailsModal = ({ open, onClose, userData }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(REQUIRED_FIELDS);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userData) {
      setFormData({ ...REQUIRED_FIELDS, ...userData });
    }
  }, [userData]);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    // Always check these fields
    const alwaysRequired = [
      "name",
      "age",
      "gender",
      "weight_kg",
      "height_cm",
      "activity_level",
      "goal",
    ];

    // Add customCalorie to required list only when goal === "custom"
    if (formData.goal === "custom") {
      alwaysRequired.push("customCalorie");
    }

    for (const key of alwaysRequired) {
      const value = formData[key];
      if (
        value === null ||
        value === undefined ||
        value.toString().trim() === ""
      ) {
        newErrors[key] = "Required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const response = await axiosInstance.post("/users/save-user", formData);
      console.log("response==", response);
      toast.success("updated successful");
      dispatch(updateUser(formData));
      onClose();
    } catch (error) {
      toast.error(error.message || error);
    }
  };

  return (
    <Modal open={open} onClose={() => {}} disableEscapeKeyDown>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          height: "80%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          overflow: "auto",
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Fill Your Details
        </Typography>

        <Grid container spacing={2} direction="column">
          {[
            "name",
            "age",
            "gender",
            "weight_kg",
            "height_cm",
            "activity_level",
          ].map((key) => (
            <Grid item xs={12} key={key}>
              {key === "gender" || key === "activity_level" ? (
                <TextField
                  select
                  fullWidth
                  label={key.replace(/_/g, " ").toUpperCase()}
                  value={formData[key]}
                  onChange={handleChange(key)}
                  error={!!errors[key]}
                  helperText={errors[key]}
                >
                  {(key === "gender" ? genders : activityLevels).map(
                    (option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    )
                  )}
                </TextField>
              ) : (
                <TextField
                  fullWidth
                  label={key.replace(/_/g, " ").toUpperCase()}
                  value={formData[key]}
                  onChange={handleChange(key)}
                  error={!!errors[key]}
                  helperText={errors[key]}
                  type={typeof formData[key] === "number" ? "number" : "text"}
                />
              )}
            </Grid>
          ))}

          {/* --- goal as radio buttons --- */}
          <Grid item xs={12}>
            <FormControl component="fieldset" error={!!errors.goal}>
              <FormLabel component="legend">GOAL</FormLabel>
              <RadioGroup
                row
                value={formData.goal}
                onChange={handleChange("goal")}
              >
                {goals.map((goal) => (
                  <FormControlLabel
                    key={goal}
                    value={goal}
                    control={<Radio />}
                    label={goal}
                  />
                ))}
              </RadioGroup>
              {errors.goal && (
                <Typography color="error" variant="caption">
                  {errors.goal}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* --- customCalorie shown only when goal === "custom" --- */}
          {formData.goal === "custom" && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CUSTOM CALORIE"
                value={formData.customCalorie}
                onChange={handleChange("customCalorie")}
                error={!!errors.customCalorie}
                helperText={errors.customCalorie}
                type="number"
                inputProps={{ min: 1000, max: 3000 }}
              />
            </Grid>
          )}
        </Grid>

        <Box mt={3} textAlign="right">
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
