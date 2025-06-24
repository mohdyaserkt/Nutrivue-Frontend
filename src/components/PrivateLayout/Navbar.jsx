import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
export const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const { handleLogout } = useLogout();
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const onLogoutClick = async () => {
    try {
      await handleLogout();
      handleMenuClose();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const handleProfileClick = () => {
    handleMenuClose();
    navigate("/profile");
  };
  const handleLogsClick = () => {
    handleMenuClose();
    navigate("/logs");
  };
  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 600, cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          NUTRIVUE
        </Typography>

        <Box>
          <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 2 }}>
            <Avatar alt="User Avatar" src="/path-to-avatar.jpg" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
            <MenuItem onClick={handleLogsClick}>Logs</MenuItem>
            <MenuItem onClick={onLogoutClick}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
