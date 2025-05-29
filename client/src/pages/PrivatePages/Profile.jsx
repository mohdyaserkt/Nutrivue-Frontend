import { useEffect, useState } from "react";
import { Typography, Skeleton, Box } from "@mui/material";

export const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUser({ name: "Alice", age: 25 });
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <Box sx={{ width: 300 }}>
      {loading ? (
        <>
          <Skeleton variant="text" width="80%" height={40} />
          <Skeleton variant="text" width="60%" />
        </>
      ) : (
        <>
          <Typography variant="h5">{user.name}</Typography>
          <Typography variant="body1">Age: {user.age}</Typography>
        </>
      )}
    </Box>
  );
};
