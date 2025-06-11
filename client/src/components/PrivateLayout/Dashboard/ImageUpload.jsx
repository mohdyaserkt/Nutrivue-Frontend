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
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../utils/axiosInstance";
export const ImageUpload = () => {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [calorieData, setCalorieData] = useState(null);

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
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

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
            🥗 Calories Detected: {calorieData.calories} kcal
          </Typography>
          {/* if your API returns food breakdown, list it here */}
          {calorieData.items && (
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                🍽️ Food Breakdown
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
                      <TableCell>
                        <strong>Protein (g)</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Carbs (g)</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Fats (g)</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {calorieData.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.calories_per_gram}</TableCell>
                        <TableCell>{item.nutrients?.protein_g}</TableCell>
                        <TableCell>{item.nutrients?.carbohydrates_g}</TableCell>
                        <TableCell>{item.nutrients?.fats_g}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {calorieData.healthy_alternatives && (
            <Box mt={3}>
              <Typography variant="h6">💡 Healthy Alternatives</Typography>
              <Typography>{calorieData.healthy_alternatives}</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
