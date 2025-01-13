import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);

interface LocationState {
  score: number;
  stressLevel: string;
  recommendations: string;
}

const ResponsePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  if (!state?.score) {
    navigate('/wellbeing');
    return null;
  }

  const { score, stressLevel, recommendations } = state;

  const getScoreColor = (score: number) => {
    if (score <= 15) return '#4caf50';
    if (score <= 25) return '#ff9800';
    if (score <= 35) return '#f44336';
    return '#d32f2f';
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        py: { xs: 4, md: 8 },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container maxWidth="md">
        <MotionPaper
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            align="center"
            sx={{ mb: 4, fontWeight: 700, color: 'primary.main' }}
          >
            Your Stress Assessment Results
          </Typography>

          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mb: 4 
            }}
          >
            <Box sx={{ position: 'relative', mb: 2 }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={120}
                thickness={4}
                sx={{ color: 'grey.200' }}
              />
              <CircularProgress
                variant="determinate"
                value={(score / 40) * 100}
                size={120}
                thickness={4}
                sx={{
                  color: getScoreColor(score),
                  position: 'absolute',
                  left: 0,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h4" component="div" color={getScoreColor(score)}>
                  {score}
                </Typography>
                <Typography variant="caption" component="div" color="text.secondary">
                  out of 40
                </Typography>
              </Box>
            </Box>

            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                color: getScoreColor(score),
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              {stressLevel}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Recommendations
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {recommendations}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/wellbeing')}
            >
              Take Assessment Again
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </Box>
        </MotionPaper>
      </Container>
    </Box>
  );
};

export default ResponsePage; 