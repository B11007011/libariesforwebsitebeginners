import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Collapse,
  Alert
} from '@mui/material';
import Calendar from '../components/Calendar';
import { db } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  DocumentData 
} from '@firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const CalendarPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [datesWithNotes, setDatesWithNotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (currentUser) {
      // Fetch all notes for the current month
    const fetchNotes = async () => {
        try {
          const notesRef = collection(db, 'users', currentUser.uid, 'notes');
          const notesSnap = await getDocs(notesRef);
          const dates = new Set<string>();
          notesSnap.forEach((doc: DocumentData) => {
            dates.add(doc.id);
          });
          setDatesWithNotes(dates);
      } catch (err) {
        console.error('Error fetching notes:', err);
      }
    };
    fetchNotes();
    }
  }, [currentUser]);

  const hasNote = (dateString: string) => {
    return datesWithNotes.has(dateString);
  };

  const handleDateChange = async (date: Date) => {
    setSelectedDate(date);
    if (currentUser) {
      try {
        const noteRef = doc(db, 'users', currentUser.uid, 'notes', date.toISOString().split('T')[0]);
        const noteDoc = await getDoc(noteRef);
        if (noteDoc.exists()) {
          setNote(noteDoc.data().content);
        } else {
          setNote('');
        }
      } catch (err) {
        console.error('Error fetching note:', err);
        setError('Failed to load note');
      }
    }
  };

  const handleSaveNote = async () => {
    if (!selectedDate || !currentUser) return;

    setSaving(true);
    setError('');

    try {
      const noteRef = doc(db, 'users', currentUser.uid, 'notes', selectedDate.toISOString().split('T')[0]);
      await setDoc(noteRef, {
        content: note,
        date: selectedDate,
        updatedAt: new Date()
      });
    } catch (err) {
      console.error('Error saving note:', err);
      setError('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 2, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Calendar
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Calendar 
              date={selectedDate || undefined} 
              onDateChange={handleDateChange}
              hasNote={hasNote}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', md: '300px' } }}>
            <Collapse in={!!selectedDate}>
        <Paper 
          elevation={0}
          sx={{ 
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {selectedDate?.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
              </Typography>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
              <TextField
                fullWidth
                multiline
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                  placeholder="Add notes for this day..."
                variant="outlined"
                size="small"
                  sx={{ mb: 2 }}
              />
              <Button
                  fullWidth
                variant="contained"
                onClick={handleSaveNote}
                  disabled={saving}
              >
                  {saving ? 'Saving...' : 'Save Note'}
              </Button>
              </Paper>
            </Collapse>
          </Box>
            </Box>
      </Box>
    </Container>
  );
};

export default CalendarPage; 