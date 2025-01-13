import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Alert,
  Snackbar
} from '@mui/material';
import { FavoriteRounded, FiberManualRecord } from '@mui/icons-material';
import { doc, getDoc, setDoc } from '@firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

interface MealPlan {
  breakfast: string;
  lunch: string;
  dinner: string;
}

const initialMealPlan: MealPlan = {
  breakfast: '',
  lunch: '',
  dinner: ''
};

const nutrients = [
  'Carbohydrates',
  'Proteins',
  'Fats',
  'Vitamins',
  'Minerals',
  'Dietary fibre',
  'Water'
];

const HealthyDietPage: React.FC = (): JSX.Element => {
  const theme = useTheme();
  const [mealPlan, setMealPlan] = useState<MealPlan>(initialMealPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchMealPlan = async () => {
      if (!currentUser) return;

      try {
        const docRef = doc(db, `users/${currentUser.uid}/diet/meal-plan`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMealPlan(docSnap.data() as MealPlan);
        }
      } catch (err) {
        console.error('Error fetching meal plan:', err);
        setError('Failed to load meal plan');
      }
    };

    fetchMealPlan();
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser) {
      setError('You must be logged in to save a meal plan');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, `users/${currentUser.uid}/diet/meal-plan`);
      await setDoc(docRef, {
        ...mealPlan,
        updatedAt: new Date()
      });
      setSuccess(true);
    } catch (err) {
      console.error('Error saving meal plan:', err);
      setError('Failed to save meal plan');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: '24px',
            border: `1px solid ${theme.palette.divider}`,
            background: `linear-gradient(180deg, 
              ${theme.palette.error.light}15 0%, 
              ${theme.palette.background.paper} 100%)`
          }}
        >
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2, 
            mb: 3 
          }}>
            <FavoriteRounded 
              sx={{ 
                color: theme.palette.error.main,
                fontSize: '2rem'
              }} 
            />
            <Typography variant="h5" component="h1">
              Healthy Diet
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Nutrients List */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle2" gutterBottom color="textSecondary">
              It would be best if you balanced these nutrients:
            </Typography>
            <List dense>
              {nutrients.map((nutrient) => (
                <ListItem key={nutrient} sx={{ py: 0 }}>
                  <ListItemIcon sx={{ minWidth: 24 }}>
                    <FiberManualRecord sx={{ fontSize: '0.5rem' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={nutrient}
                    primaryTypographyProps={{
                      variant: 'body2'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Meal Plan Form */}
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Breakfast"
              multiline
              rows={2}
              value={mealPlan.breakfast}
              onChange={(e) => setMealPlan(prev => ({ ...prev, breakfast: e.target.value }))}
              placeholder="Enter your breakfast plan..."
              variant="outlined"
              size="small"
              fullWidth
            />

            <TextField
              label="Lunch"
              multiline
              rows={2}
              value={mealPlan.lunch}
              onChange={(e) => setMealPlan(prev => ({ ...prev, lunch: e.target.value }))}
              placeholder="Enter your lunch plan..."
              variant="outlined"
              size="small"
              fullWidth
            />

            <TextField
              label="Dinner"
              multiline
              rows={2}
              value={mealPlan.dinner}
              onChange={(e) => setMealPlan(prev => ({ ...prev, dinner: e.target.value }))}
              placeholder="Enter your dinner plan..."
              variant="outlined"
              size="small"
              fullWidth
            />

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              fullWidth
              size="large"
              sx={{ mt: 2 }}
            >
              {loading ? 'Saving...' : 'Save Meal Plan'}
            </Button>
          </Box>
        </Paper>
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
          Meal plan saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HealthyDietPage; 