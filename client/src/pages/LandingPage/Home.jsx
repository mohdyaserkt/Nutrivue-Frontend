import React from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        px: 2,
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant={isMobile ? "h4" : "h2"}
          fontWeight={700}
          gutterBottom
          textAlign={isMobile ? "center" : "left"}
        >
          NUTRIVUE
        </Typography>

        <Typography
          variant={isMobile ? "h6" : "h5"}
          color="text.secondary"
          paragraph
          textAlign={isMobile ? "center" : "left"}
        >
          Your smart nutrition assistant. Powered by AI.
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          mb={4}
          textAlign={isMobile ? "center" : "left"}
        >
          Just snap a photo of your meal and instantly get accurate calorie and
          nutrition info. No manual logging, no guessing — just results.
        </Typography>

        <Box textAlign={isMobile ? "center" : "left"}>
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            size="large"
            sx={{
              backgroundColor: "black",
              color: "white",
              "&:hover": {
                backgroundColor: "#333",
              },
            }}
          >
            Try It Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
};
