import { useState, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../utils/axiosInstance";
export const ImageUpload = () => {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [calorieData, setCalorieData] = useState(null);
  const [consumedGrams, setConsumedGrams] = useState({});
  const [mealType, setMealType] = useState("");
  const [loggedItems, setLoggedItems] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  const handleUploadClick = async () => {
    if (!imageFile) {
      toast.error("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);
    console.log("formData==", formData);
    try {
      setUploading(true);
      const response = await axiosInstance.post("/calorie/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setCalorieData(response.data);
      console.log("Upload success:", response.data);
      toast.success(`Upload success`);
      setConsumedGrams({});
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  const handleMealTypeChange = (event) => {
    setMealType(event.target.value);
  };

  const handleConsumedChange = (index, value) => {
    setConsumedGrams((prev) => ({
      ...prev,
      [index]: value,
    }));
  };
  const handleSubmitConsumedData = async () => {
    if (!mealType) {
      toast.error("Please select a meal type.");
      return;
    }

    const items = calorieData.items.map((item, index) => ({
      ...item, // preserve all existing properties as-is
      weight_grams: Number(consumedGrams[index] || 0),
    }));

    const payload = {
      meal_type: mealType,
      items,
    };

    try {
      const response = await axiosInstance.post("/food/log/batch", payload);
      setLoggedItems(response?.data);
      toast.success("Consumed data submitted successfully!");
      console.log("Submitted data:", response.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit consumed data.");
    }
  };
  const nutrientKeys = calorieData?.items?.length
    ? Array.from(
        new Set(
          calorieData.items.flatMap((item) => Object.keys(item.nutrients || {}))
        )
      )
    : [];

  const loggedNutrientKeys = loggedItems?.length
    ? Array.from(
        new Set(
          loggedItems.flatMap((item) => Object.keys(item.nutrients || {}))
        )
      )
    : [];
  const hasAnyInput = Object.values(consumedGrams).some(
    (val) => Number(val) > 0
  );

  return (
    <Box sx={{ width: "100%", maxWidth: 1000, mx: "auto", mt: 4 }}>
      <Button
        variant="contained"
        onClick={handleUploadClick}
        fullWidth
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </Button>

      <Paper
        {...getRootProps()}
        elevation={3}
        sx={{
          mt: 2,
          p: 3,
          textAlign: "center",
          border: "2px dashed #ccc",
          cursor: "pointer",
          backgroundColor: isDragActive ? "#f0f0f0" : "inherit",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the image here...</Typography>
        ) : (
          <Typography>Drag & drop an image here, or click to select</Typography>
        )}
      </Paper>

      {previewUrl && (
        <Box mt={2}>
          <Typography variant="subtitle1">Preview:</Typography>
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: 300,
                marginTop: 8,
                borderRadius: 8,
              }}
            />
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => {
                setPreviewUrl(null);
                setImageFile(null);
                setCalorieData(null);
              }}
              sx={{ mt: 1 }}
              fullWidth
            >
              Remove Image
            </Button>
          </Box>
        </Box>
      )}
      {calorieData && (
        <Box mt={2}>
          <Typography variant="h6">
            Calories Detected: {calorieData.calories} kcal
          </Typography>
          {/* if your API returns food breakdown, list it here */}
          {calorieData.items && (
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Food Breakdown
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Calories/gram</strong>
                      </TableCell>
                      {nutrientKeys.map((key) => (
                        <TableCell key={key}>
                          <strong>{key.replace(/_/g, " ")}</strong>
                        </TableCell>
                      ))}
                      <TableCell>
                        <strong>Consumed (g)</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {calorieData.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.calories_per_gram}</TableCell>
                        {nutrientKeys.map((key) => (
                          <TableCell key={key}>
                            {item.nutrients?.[key] ?? "-"}
                          </TableCell>
                        ))}
                        <TableCell>
                          <TextField
                            type="number"
                            variant="outlined"
                            size="small"
                            value={consumedGrams[index] || ""}
                            onChange={(e) =>
                              handleConsumedChange(index, e.target.value)
                            }
                            inputProps={{ min: 0 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Box
                  my={3}
                  display="flex"
                  flexDirection={"column"}
                  alignItems="center"
                  gap={2}
                >
                  <Select
                    value={mealType}
                    onChange={handleMealTypeChange}
                    displayEmpty
                    size="small"
                    sx={{ minWidth: 200 }}
                  >
                    <MenuItem value="" disabled>
                      Select Meal Type
                    </MenuItem>
                    <MenuItem value="breakfast">Breakfast</MenuItem>
                    <MenuItem value="meal">Meal</MenuItem>
                    <MenuItem value="dinner">Dinner</MenuItem>
                    <MenuItem value="snacks">Snacks</MenuItem>
                  </Select>

                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitConsumedData}
                    disabled={
                      uploading ||
                      calorieData.items.length === 0 ||
                      !hasAnyInput
                    }
                  >
                    Submit Consumed Data
                  </Button>
                </Box>
              </TableContainer>
            </Box>
          )}

          {calorieData.healthy_alternatives && (
            <Box mt={3}>
              <Typography variant="h6"> Healthy Alternatives</Typography>
              <Typography>{calorieData.healthy_alternatives}</Typography>
            </Box>
          )}
        </Box>
      )}

      {loggedItems.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Logged Food Entries
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Food</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Weight (g)</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Calories</strong>
                  </TableCell>

                  {/* Dynamic nutrient headers */}
                  {loggedNutrientKeys.map((key) => (
                    <TableCell key={key}>
                      <strong>{key.replace(/_/g, " ")}</strong>
                    </TableCell>
                  ))}

                  <TableCell>
                    <strong>Meal</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Logged At</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loggedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.food_name}</TableCell>
                    <TableCell>{item.weight_grams}</TableCell>
                    <TableCell>{item.calories_consumed}</TableCell>

                    {/* Dynamic nutrient values */}
                    {loggedNutrientKeys.map((key) => (
                      <TableCell key={key}>
                        {item.nutrients?.[key] ?? "-"}
                      </TableCell>
                    ))}

                    <TableCell>{item.meal_type}</TableCell>
                    <TableCell>
                      {new Date(item.logged_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};
