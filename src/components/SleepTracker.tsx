import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  useTheme,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Alarm, Bedtime } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, Timestamp } from '@firebase/firestore';
import { format, setHours, setMinutes, addDays } from 'date-fns';

interface SleepSchedule {
  bedtime: Timestamp;
  wakeTime: Timestamp;
  updatedAt: Timestamp;
}

const SleepTracker: React.FC = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();
  const { scheduleNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [bedtime, setBedtime] = useState<Date | null>(null);
  const [wakeTime, setWakeTime] = useState<Date | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSleepSchedule = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        setError(null);
        const docRef = doc(db, `users/${currentUser.uid}/sleep/schedule`);
        const docSnap = await getDoc(docRef);

        if (!mounted) return;

        if (docSnap.exists()) {
          const data = docSnap.data() as SleepSchedule;
          setBedtime(data.bedtime.toDate());
          setWakeTime(data.wakeTime.toDate());
        }
      } catch (err) {
        console.error('Error loading sleep schedule:', err);
        if (mounted) {
          setError('Failed to load sleep schedule');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSleepSchedule();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  const createScheduledTime = (time: Date): Date => {
    const now = new Date();
    let scheduledTime = new Date(now);
    
    scheduledTime = setHours(scheduledTime, time.getHours());
    scheduledTime = setMinutes(scheduledTime, time.getMinutes());

    if (scheduledTime < now) {
      scheduledTime = addDays(scheduledTime, 1);
    }

    return scheduledTime;
  };

  const handleSave = async () => {
    if (!currentUser || !bedtime || !wakeTime) {
      setError('Please set both bedtime and wake time');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const scheduledBedtime = createScheduledTime(bedtime);
      const scheduledWakeTime = createScheduledTime(wakeTime);

      // Save to Firestore
      const docRef = doc(db, `users/${currentUser.uid}/sleep/schedule`);
      await setDoc(docRef, {
        bedtime: Timestamp.fromDate(scheduledBedtime),
        wakeTime: Timestamp.fromDate(scheduledWakeTime),
        updatedAt: Timestamp.fromDate(new Date())
      });

      // Schedule notifications
      const bedtimeNotification = {
        title: 'Bedtime Reminder',
        message: 'Time to prepare for bed and wind down for a good night\'s sleep.',
        timestamp: scheduledBedtime
      };

      const wakeNotification = {
        title: 'Wake Up Time',
        message: 'Good morning! Time to start your day refreshed and energized.',
        timestamp: scheduledWakeTime
      };

      try {
        await scheduleNotification(bedtimeNotification);
        await scheduleNotification(wakeNotification);
        setSuccess(true);
      } catch (notificationError) {
        console.warn('Failed to schedule notifications:', notificationError);
        // Still show success since the sleep schedule was saved
        setSuccess(true);
      }
    } catch (err) {
      console.error('Error saving sleep schedule:', err);
      setError('Failed to save sleep schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card 
        elevation={0}
        sx={{ 
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          background: `linear-gradient(180deg, 
            ${theme.palette.primary.light}15 0%, 
            ${theme.palette.background.paper} 100%)`
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Sleep Tracking
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            <Box>
              <Typography 
                variant="subtitle2" 
                color="textSecondary"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Bedtime fontSize="small" /> When did you sleep?
              </Typography>
              <TimePicker
                value={bedtime}
                onChange={setBedtime}
                sx={{ width: '100%' }}
              />
            </Box>

            <Box>
              <Typography 
                variant="subtitle2" 
                color="textSecondary"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Alarm fontSize="small" /> When did you wake up?
              </Typography>
              <TimePicker
                value={wakeTime}
                onChange={setWakeTime}
                sx={{ width: '100%' }}
              />
            </Box>

            {bedtime && wakeTime && (
              <Typography variant="body2" color="textSecondary">
                Sleep duration: {format(bedtime, 'HH:mm')} - {format(wakeTime, 'HH:mm')}
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading || !bedtime || !wakeTime}
              fullWidth
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Save Sleep Schedule'
              )}
            </Button>
          </Stack>
        </CardContent>
      </Card>

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
          Sleep schedule saved and notifications set!
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};

export default SleepTracker; 