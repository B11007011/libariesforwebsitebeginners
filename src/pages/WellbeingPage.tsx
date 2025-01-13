import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import SleepTracker from '../components/SleepTracker';

const WellbeingPage: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Wellbeing Tracker
        </Typography>
        <SleepTracker />
      </Box>
    </Container>
  );
};

export default WellbeingPage; 