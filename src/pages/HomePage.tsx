import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Button,
  Card,
  CardContent,
  useTheme,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import SleepTracker from '../components/SleepTracker';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { QuestionAnswer, Book, Reply } from '@mui/icons-material';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { db } from '../firebase';
import { format } from 'date-fns';

interface DailyQuestion {
  question: string;
  response?: string;
  date?: string;
  updatedAt?: Date;
}

const dailyQuestion: DailyQuestion = {
  question: "What are the challenges you are facing today?",
  date: format(new Date(), 'yyyy-MM-dd')
};

const HomePage: React.FC = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const [response, setResponse] = useState<string>('');
  const [previousResponse, setPreviousResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadResponses = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        setError(null);
        // Load today's response
        const docRef = doc(db, `users/${currentUser.uid}/daily-questions/${dailyQuestion.date}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.response) {
            setResponse(data.response);
          }
        }

        // Load previous day's response
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const prevDate = format(yesterday, 'yyyy-MM-dd');
        const prevDocRef = doc(db, `users/${currentUser.uid}/daily-questions/${prevDate}`);
        const prevDocSnap = await getDoc(prevDocRef);

        if (prevDocSnap.exists()) {
          const data = prevDocSnap.data();
          if (data.response) {
            setPreviousResponse(data.response);
          }
        }
      } catch (error) {
        console.error('Error loading responses:', error);
        setError('Failed to load responses');
      } finally {
        setLoading(false);
      }
    };

    loadResponses();
  }, [currentUser]);

  const handleSaveResponse = async () => {
    if (!currentUser || !response.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, `users/${currentUser.uid}/daily-questions/${dailyQuestion.date}`);
      const newResponse = {
        question: dailyQuestion.question,
        response: response.trim(),
        date: dailyQuestion.date,
        updatedAt: new Date()
      };

      await setDoc(docRef, newResponse);
      setSuccess(true);
    } catch (error) {
      console.error('Error saving response:', error);
      setError('Failed to save response');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Home
        </Typography>

        <Grid container spacing={3}>
          {/* Sleep Routine Section */}
          <Grid item xs={12}>
            <SleepTracker />
          </Grid>

          {/* Previous Response Section */}
          <Grid item xs={12} md={6}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
                bgcolor: theme.palette.primary.light + '20',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                  cursor: 'pointer'
                }
              }}
              onClick={() => {
                if (previousResponse) {
                  setResponse(previousResponse);
                }
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Previous Response
                  </Typography>
                  {previousResponse && (
                    <Tooltip title="Click to use as today's response">
                      <IconButton size="small">
                        <Reply fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 1,
                  minHeight: 100,
                  whiteSpace: 'pre-wrap',
                  color: previousResponse ? 'text.primary' : 'text.secondary',
                  fontSize: '0.875rem'
                }}>
                  {previousResponse || "No previous response yet. Your response from yesterday will appear here."}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  component={Link}
                  to="/wellbeing"
                  variant="contained"
                  fullWidth
                  sx={{ 
                    p: 3,
                    height: '100%',
                    bgcolor: theme.palette.success.light + '40',
                    color: theme.palette.success.dark,
                    '&:hover': {
                      bgcolor: theme.palette.success.light + '60'
                    }
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <QuestionAnswer sx={{ fontSize: 40, mb: 1 }} />
                    <Typography>Wellbeing Questions</Typography>
                  </Box>
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  component={Link}
                  to="/diary"
                  variant="contained"
                  fullWidth
                  sx={{ 
                    p: 3,
                    height: '100%',
                    bgcolor: theme.palette.warning.light + '40',
                    color: theme.palette.warning.dark,
                    '&:hover': {
                      bgcolor: theme.palette.warning.light + '60'
                    }
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Book sx={{ fontSize: 40, mb: 1 }} />
                    <Typography>Diary</Typography>
                  </Box>
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Question of the Day */}
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <Typography variant="h6" gutterBottom>
                Question of the Day
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                {dailyQuestion.question}
              </Typography>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={handleCloseError}>
                  {error}
                </Alert>
              )}
              <TextField
                fullWidth
                multiline
                rows={4}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your response here..."
                variant="outlined"
                disabled={loading}
                error={!!error}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleSaveResponse}
                disabled={loading || !response.trim()}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Save Response'}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSuccess} 
          severity="success"
          sx={{ width: '100%' }}
        >
          Response saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HomePage; 