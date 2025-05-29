
import { Box, Typography, Container, Grid, Link } from '@mui/material';

export const Footer = () => {
  return (
    <Box sx={{ backgroundColor: 'black', color: 'white', py: 4, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Nutrivue
            </Typography>
            <Typography variant="body2">
              Empowering health through personalized nutrition insights.
            </Typography>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2">Email: support@nutrivue.com</Typography>
            <Typography variant="body2">Phone: +1 (555) 123-4567</Typography>
          </Grid>

          {/* Location */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Location
            </Typography>
            <Typography variant="body2">123 Wellness St.</Typography>
            <Typography variant="body2">Health City, HC 98765</Typography>
          </Grid>
        </Grid>

        {/* Divider */}
        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="grey.500">
            &copy; {new Date().getFullYear()} Nutrivue. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
