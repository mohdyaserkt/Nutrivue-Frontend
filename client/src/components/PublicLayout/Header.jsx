import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const buttonLabel = isLoginPage ? "Sign Up" : "Sign In";
  const buttonRoute = isLoginPage ? "/register" : "/login";

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "black", boxShadow: "none" }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Logo / Brand */}
        <Typography
          variant="h6"
          sx={{ fontWeight: 700, letterSpacing: 1.5, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          NUTRIVUE
        </Typography>

        {/* Auth Button */}
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => navigate(buttonRoute)}
        >
          {buttonLabel}
        </Button>
      </Toolbar>
    </AppBar>
  );
};
