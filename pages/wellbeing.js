import { useState } from 'react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Box, Button, Radio, RadioGroup, FormControl, FormControlLabel, Typography, Container, Alert } from '@mui/material';

const questions = [
  {
    id: 1,
    question: "How often do you feel overwhelmed by your daily tasks?",
    options: [
      { value: 1, label: "Never" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Always" }
    ]
  },
  {
    id: 2,
    question: "How would you rate your sleep quality?",
    options: [
      { value: 4, label: "Very poor" },
      { value: 3, label: "Poor" },
      { value: 2, label: "Good" },
      { value: 1, label: "Excellent" }
    ]
  },
  {
    id: 3,
    question: "How often do you feel anxious or worried?",
    options: [
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Most of the time" }
    ]
  },
  {
    id: 4,
    question: "How well can you concentrate on tasks?",
    options: [
      { value: 1, label: "Very well" },
      { value: 2, label: "Moderately well" },
      { value: 3, label: "With difficulty" },
      { value: 4, label: "Cannot concentrate" }
    ]
  },
  {
    id: 5,
    question: "How often do you feel irritable or angry?",
    options: [
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Very often" }
    ]
  },
  {
    id: 6,
    question: "How would you rate your energy levels?",
    options: [
      { value: 1, label: "High energy" },
      { value: 2, label: "Moderate energy" },
      { value: 3, label: "Low energy" },
      { value: 4, label: "Very low energy" }
    ]
  },
  {
    id: 7,
    question: "How often do you take breaks during work?",
    options: [
      { value: 1, label: "Regularly" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Rarely" },
      { value: 4, label: "Never" }
    ]
  },
  {
    id: 8,
    question: "How would you rate your work-life balance?",
    options: [
      { value: 1, label: "Excellent" },
      { value: 2, label: "Good" },
      { value: 3, label: "Poor" },
      { value: 4, label: "Very poor" }
    ]
  },
  {
    id: 9,
    question: "How often do you engage in physical exercise?",
    options: [
      { value: 1, label: "Regularly" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Rarely" },
      { value: 4, label: "Never" }
    ]
  },
  {
    id: 10,
    question: "How often do you feel satisfied with your daily achievements?",
    options: [
      { value: 1, label: "Most of the time" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Rarely" },
      { value: 4, label: "Never" }
    ]
  }
];

export default function WellbeingAssessment() {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }));
  };

  const calculateResult = async () => {
    const totalScore = Object.values(answers).reduce((sum, value) => sum + value, 0);
    setScore(totalScore);
    setShowResult(true);

    // Save to Firebase
    try {
      setSaving(true);
      setError(null);
      
      const assessmentData = {
        answers,
        score: totalScore,
        stressLevel: getStressLevel(totalScore),
        recommendations: getRecommendations(totalScore),
        timestamp: Timestamp.now(),
        createdAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, 'wellbeing-assessments'), assessmentData);
      console.log('Assessment saved with ID:', docRef.id);
    } catch (err) {
      console.error('Error saving assessment:', err);
      setError('Failed to save your assessment. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getStressLevel = (score) => {
    if (score <= 15) return "Low stress level";
    if (score <= 25) return "Moderate stress level";
    if (score <= 35) return "High stress level";
    return "Very high stress level";
  };

  const progress = Math.round((Object.keys(answers).length / questions.length) * 100);

  const getRecommendations = (score) => {
    if (score <= 15) {
      return "You're managing stress well. Keep up your healthy habits!";
    } else if (score <= 25) {
      return "Consider incorporating more stress-management techniques like meditation or regular exercise.";
    } else if (score <= 35) {
      return "It's important to take action. Try talking to someone you trust, and consider professional support.";
    }
    return "Please seek professional help to manage your stress levels. Your wellbeing is important.";
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Wellbeing Assessment
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {!showResult ? (
        <>
          <Box sx={{ mb: 4, width: '100%' }}>
            <Typography variant="body2" color="text.secondary">
              Progress: {progress}%
            </Typography>
            <Box sx={{ 
              width: '100%', 
              height: 8, 
              bgcolor: '#eee',
              borderRadius: 4,
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                width: `${progress}%`, 
                height: '100%', 
                bgcolor: 'primary.main',
                transition: 'width 0.3s'
              }} />
            </Box>
          </Box>

          {questions.map((q) => (
            <Box key={q.id} sx={{ 
              mb: 4, 
              p: 3, 
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: 1
            }}>
              <Typography variant="h6" gutterBottom>
                {q.question}
              </Typography>
              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  value={answers[q.id] || ''}
                >
                  {q.options.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio color="primary" />}
                      label={option.label}
                      sx={{ my: 0.5 }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          ))}
          
          <Button 
            variant="contained" 
            onClick={calculateResult}
            disabled={Object.keys(answers).length !== questions.length || saving}
            fullWidth
            size="large"
            sx={{ mt: 2 }}
          >
            {saving ? 'Saving...' : 'Get Results'}
          </Button>
        </>
      ) : (
        <Box sx={{ 
          mt: 4, 
          p: 4, 
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: 1
        }}>
          <Typography variant="h5" gutterBottom align="center">
            Your Results
          </Typography>
          <Typography variant="h6" color="primary" align="center" sx={{ mb: 3 }}>
            {getStressLevel(score)}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Score: {score} out of 40
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {getRecommendations(score)}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => {
              setShowResult(false);
              setAnswers({});
              setScore(0);
              setError(null);
            }}
            fullWidth
            sx={{ mt: 2 }}
          >
            Take Assessment Again
          </Button>
        </Box>
      )}
    </Container>
  );
} 