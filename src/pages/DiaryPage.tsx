import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  IconButton,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc,
  Timestamp 
} from '@firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp | Date;
}

const DiaryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  // Load diary entries
  useEffect(() => {
    let mounted = true;

    const loadEntries = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        setError(null);
        const entriesRef = collection(db, `users/${currentUser.uid}/diary-entries`);
        const q = query(entriesRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        if (!mounted) return;

        const loadedEntries = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt instanceof Timestamp 
            ? doc.data().createdAt.toDate() 
            : doc.data().createdAt
        })) as DiaryEntry[];

        setEntries(loadedEntries);
      } catch (err) {
        console.error('Error loading entries:', err);
        if (mounted) {
          setError('Failed to load diary entries');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadEntries();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  const handleSave = async () => {
    if (!currentUser || !title.trim() || !content.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const entriesRef = collection(db, `users/${currentUser.uid}/diary-entries`);
      const newEntry = {
        title: title.trim(),
        content: content.trim(),
        createdAt: Timestamp.now()
      };

      await addDoc(entriesRef, newEntry);

      // Reset form
      setTitle('');
      setContent('');
      setSuccess(true);

      // Reload entries
      const q = query(entriesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const updatedEntries = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt instanceof Timestamp 
          ? doc.data().createdAt.toDate() 
          : doc.data().createdAt
      })) as DiaryEntry[];
      
      setEntries(updatedEntries);
    } catch (err) {
      console.error('Error saving entry:', err);
      setError('Failed to save diary entry');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentUser || !entryToDelete) return;

    setLoading(true);
    setError(null);
    try {
      const entryRef = doc(db, `users/${currentUser.uid}/diary-entries/${entryToDelete}`);
      await deleteDoc(entryRef);

      // Update local state
      setEntries(prev => prev.filter(entry => entry.id !== entryToDelete));
      setSuccess(true);
    } catch (err) {
      console.error('Error deleting entry:', err);
      setError('Failed to delete the entry');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
    }
  };

  const openDeleteDialog = (entryId: string) => {
    setEntryToDelete(entryId);
    setDeleteDialogOpen(true);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Journal
        </Typography>

        {/* New Entry Form */}
        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" gutterBottom>
            New Entry
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                error={!!error}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                error={!!error}
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading || !title.trim() || !content.trim()}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Save Entry'}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Previous Entries */}
        <Typography variant="h6" gutterBottom>
          Previous Entries
        </Typography>
        <Grid container spacing={2}>
          {entries.map((entry) => (
            <Grid item xs={12} key={entry.id}>
              <Card elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="h6">{entry.title}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {format(
                          entry.createdAt instanceof Timestamp 
                            ? entry.createdAt.toDate() 
                            : entry.createdAt, 
                          'MM/dd/yyyy'
                        )}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => openDeleteDialog(entry.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {entry.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Entry</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this entry? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Operation completed successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DiaryPage; 