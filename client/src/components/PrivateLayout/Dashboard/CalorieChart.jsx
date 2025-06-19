import {
  Box,
  Grid,
  Typography,
  useMediaQuery,
  Paper,
  useTheme,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../../utils/axiosInstance";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend);

export const CalorieChart = ({ isSubmitted }) => {
  const userDetails = useSelector((state) => state?.user);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const today = new Date().toISOString().split("T")[0];
  const targetCalories = userDetails?.target_calories || 6000;

  const [calorieData, setCalorieData] = useState({});

  const fetchTodaysCalorie = async () => {
    try {
      const { data } = await axiosInstance.get(`/food/log/daily/${today}`);
      setCalorieData(data?.summary ?? {});
      console.log(data.summary);
    } catch (error) {
      toast.error(error.message ?? "Failed to fetch calorie data.");
    }
  };

  useEffect(() => {
    fetchTodaysCalorie();
  }, [isSubmitted]);

  const remainingCalories = Math.max(
    targetCalories - calorieData?.total_calories,
    0
  );

  const caloriePieData = {
    labels: ["Consumed", "Remaining"],
    datasets: [
      {
        data: [calorieData?.total_calories, remainingCalories],
        backgroundColor: ["#1976d2", "#eeeeee"],
      },
    ],
  };

  const nutrientData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#ff9800", "#4caf50", "#f44336"],
      },
    ],
  };

  // Dynamically add only non-calorie nutrients
  Object.entries(calorieData)
    .filter(([key]) => key !== "total_calories")
    .forEach(([key, value]) => {
      const label = key.replace("total_", "").replace(/_/g, " ");
      nutrientData.labels.push(label);
      nutrientData.datasets[0].data.push(value);
    });

  return (
    <Box width="100%" p={2}>
      <Paper
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" mb={3}>
          Today's Nutrition Overview
        </Typography>

        <Grid container spacing={4}>
          {/* Left Chart */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1" mb={2}>
                Calories Consumed vs Target ({targetCalories} kcal)
              </Typography>
              <Box sx={{ width: isMobile ? "80%" : 250, height: 250 }}>
                <Pie
                  data={caloriePieData}
                  options={{ maintainAspectRatio: false }}
                />
              </Box>
              <Typography mt={2}>
                {calorieData.total_calories ?? 0} / {targetCalories} kcal
              </Typography>
            </Paper>
          </Grid>

          {/* Right Chart */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1" mb={2}>
                Macronutrient Breakdown
              </Typography>
              <Box sx={{ width: isMobile ? "80%" : 250, height: 250 }}>
                <Pie
                  data={nutrientData}
                  options={{ maintainAspectRatio: false }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
