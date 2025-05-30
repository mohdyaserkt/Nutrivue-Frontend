import  { useState, useCallback } from "react";
import { Box, Button, Typography, Paper } from "@mui/material";
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
      const response = await axiosInstance.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setCalorieData(response.data);
      console.log("Upload success:", response.data);
      toast(`Calories detected: ${response.data.calories}`);
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
          {/* Optional: if your API returns food breakdown, list it here */}
          {calorieData.breakdown && (
            <Box mt={1}>
              <Typography variant="subtitle2">Food Breakdown:</Typography>
              <ul>
                {calorieData.breakdown.map((item, idx) => (
                  <li key={idx}>
                    {item.name}: {item.calories} kcal
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};
