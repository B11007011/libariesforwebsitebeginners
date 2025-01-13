import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

interface Question {
  id: number;
  text: string;
  options: Array<{
    label: string;
    value: number;
  }>;
}

const questions: Question[] = [
  {
    id: 1,
    text: "How often do you feel overwhelmed by your daily tasks?",
    options: [
      { label: "Never", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Always", value: 4 }
    ]
  },
  {
    id: 2,
    text: "How would you rate your sleep quality?",
    options: [
      { label: "Excellent", value: 1 },
      { label: "Good", value: 2 },
      { label: "Poor", value: 3 },
      { label: "Very poor", value: 4 }
    ]
  },
  {
    id: 3,
    text: "How often do you feel anxious or worried?",
    options: [
      { label: "Rarely", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Most of the time", value: 4 }
    ]
  },
  {
    id: 4,
    text: "How well can you concentrate on tasks?",
    options: [
      { label: "Very well", value: 1 },
      { label: "Moderately well", value: 2 },
      { label: "With difficulty", value: 3 },
      { label: "Cannot concentrate", value: 4 }
    ]
  },
  {
    id: 5,
    text: "How often do you feel irritable or angry?",
    options: [
      { label: "Rarely", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Often", value: 3 },
      { label: "Very often", value: 4 }
    ]
  },
  {
    id: 6,
    text: "How would you rate your energy levels?",
    options: [
      { label: "High energy", value: 1 },
      { label: "Moderate energy", value: 2 },
      { label: "Low energy", value: 3 },
      { label: "Very low energy", value: 4 }
    ]
  },
  {
    id: 7,
    text: "How often do you take breaks during work?",
    options: [
      { label: "Regularly", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Rarely", value: 3 },
      { label: "Never", value: 4 }
    ]
  },
  {
    id: 8,
    text: "How would you rate your work-life balance?",
    options: [
      { label: "Excellent", value: 1 },
      { label: "Good", value: 2 },
      { label: "Poor", value: 3 },
      { label: "Very poor", value: 4 }
    ]
  },
  {
    id: 9,
    text: "How often do you engage in physical exercise?",
    options: [
      { label: "Regularly", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Rarely", value: 3 },
      { label: "Never", value: 4 }
    ]
  },
  {
    id: 10,
    text: "How often do you feel satisfied with your daily achievements?",
    options: [
      { label: "Most of the time", value: 1 },
      { label: "Sometimes", value: 2 },
      { label: "Rarely", value: 3 },
      { label: "Never", value: 4 }
    ]
  }
];

const WellbeingQuestionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [direction, setDirection] = useState<'left' | 'right'>('right');

  const progress = (Object.keys(answers).length / questions.length) * 100;

  const getStressLevel = (score: number) => {
    if (score <= 15) return "Low stress level";
    if (score <= 25) return "Moderate stress level";
    if (score <= 35) return "High stress level";
    return "Very high stress level";
  };

  const getRecommendations = (score: number) => {
    if (score <= 15) {
      return "You're managing stress well. Keep up your healthy habits!";
    } else if (score <= 25) {
      return "Consider incorporating more stress-management techniques like meditation or regular exercise.";
    } else if (score <= 35) {
      return "It's important to take action. Try talking to someone you trust, and consider professional support.";
    }
    return "Please seek professional help to manage your stress levels. Your wellbeing is important.";
  };

  const handleAnswer = useCallback((questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  }, []);

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, value) => sum + value, 0);
  };

  const handleNext = useCallback(() => {
    setDirection('right');
    if (activeStep === questions.length - 1) {
      const score = calculateScore();
      navigate('/response', { 
        state: { 
          score,
          stressLevel: getStressLevel(score),
          recommendations: getRecommendations(score)
        } 
      });
    } else {
      setActiveStep(prev => prev + 1);
    }
  }, [activeStep, answers, navigate]);

  const handleBack = useCallback(() => {
    setDirection('left');
    setActiveStep(prev => prev - 1);
  }, []);

  const currentQuestion = questions[activeStep];

  const slideVariants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'right' ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: 'left' | 'right') => ({
      zIndex: 0,
      x: direction === 'right' ? -1000 : 1000,
      opacity: 0
    })
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
            Stress Assessment
          </Typography>

          <Box sx={{ mb: 4 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                },
              }}
            />
            <Typography 
              variant="body2" 
              color="text.secondary" 
              align="center"
              sx={{ mt: 1 }}
            >
              Question {activeStep + 1} of {questions.length}
            </Typography>
          </Box>

          <AnimatePresence custom={direction} mode="wait">
            <MotionBox
              key={activeStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              <FormControl component="fieldset" sx={{ width: '100%' }}>
                <FormLabel component="legend" sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {currentQuestion.text}
                  </Typography>
                </FormLabel>
                <RadioGroup
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswer(currentQuestion.id, Number(e.target.value))}
                >
                  {currentQuestion.options.map((option) => (
                    <motion.div
                      key={option.value}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormControlLabel
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                        sx={{ 
                          mb: 2,
                          p: 1.5,
                          width: '100%',
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          }
                        }}
                      />
                    </motion.div>
                  ))}
                </RadioGroup>
              </FormControl>
            </MotionBox>
          </AnimatePresence>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              startIcon={<BackIcon />}
              onClick={handleBack}
              disabled={activeStep === 0}
              variant="outlined"
            >
              Back
            </Button>
            <Button
              endIcon={<NextIcon />}
              onClick={handleNext}
              disabled={!answers[currentQuestion.id]}
              variant="contained"
            >
              {activeStep === questions.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </MotionPaper>
      </Container>
    </Box>
  );
};

export default WellbeingQuestionsPage; 