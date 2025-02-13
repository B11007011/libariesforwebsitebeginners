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
import { COLLECTIONS, addNote, getNote } from '../services/database';

const CalendarPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [datesWithNotes, setDatesWithNotes] = useState<Set<string>>(new Set());

  const fetchNotes = async () => {
    if (!currentUser) {
      console.log('No user logged in');
      return;
    }
    try {
      console.log('Fetching notes for user:', currentUser.uid);
      const notesRef = collection(db, COLLECTIONS.NOTES(currentUser.uid));
      const notesSnap = await getDocs(notesRef);
      const dates = new Set<string>();
      notesSnap.forEach((doc: DocumentData) => {
        console.log('Found note for date:', doc.id);
        dates.add(doc.id);
      });
      setDatesWithNotes(dates);
      console.log('Total notes found:', dates.size);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to fetch notes');
    }
  };

  useEffect(() => {
    if (currentUser) {
      console.log('User authenticated, fetching notes...');
      fetchNotes();
    }
  }, [currentUser]);

  const hasNote = (dateString: string) => {
    return datesWithNotes.has(dateString);
  };

  const handleDateChange = async (date: Date) => {
    setSelectedDate(date);
    if (!currentUser) {
      console.log('No user logged in for date change');
      return;
    }
    
    try {
      console.log('Loading note for date:', date.toISOString().split('T')[0]);
      const noteData = await getNote(currentUser.uid, date);
      if (noteData) {
        console.log('Note found:', noteData);
        setNote(noteData.content);
      } else {
        console.log('No note found for date');
        setNote('');
      }
    } catch (err) {
      console.error('Error fetching note:', err);
      setError('Failed to load note');
    }
  };

  const handleSaveNote = async () => {
    if (!currentUser || !selectedDate) {
      console.log('Missing user or date for save');
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      console.log('Saving note for date:', selectedDate.toISOString().split('T')[0]);
      await addNote(currentUser.uid, selectedDate, note);
      console.log('Note saved successfully');
      
      await fetchNotes(); // Refresh the calendar
      setSaving(false);
    } catch (err) {
      console.error('Error saving note:', err);
      setError('Failed to save note');
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