import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Container, List, ListItem, ListItemText, Divider, CircularProgress } from '@mui/material';
import { createAnnouncement, getAnnouncements } from '../../services/announcementService';

const AdminAnnouncement = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await getAnnouncements();
        setAnnouncements(data || []);
        setError('');
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Failed to fetch announcements');
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await createAnnouncement(title, description);
      setTitle('');
      setDescription('');
      setSuccess('Announcement created successfully!');
      setError('');
      
      // Refresh announcements
      const data = await getAnnouncements();
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Error creating announcement:', err);
      setError('Failed to create announcement. Please try again.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) {
      console.error('Invalid timestamp:', timestamp);
      return 'Date not available';
    }
    
    try {
      const date = timestamp.toDate();
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Date not available';
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create Announcement
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        {success && (
          <Typography color="success.main" sx={{ mb: 2 }}>
            {success}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />
          
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={4}
            required
            disabled={loading}
          />
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Announcement'}
          </Button>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Recent Announcements
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : announcements.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ p: 2 }}>
            No announcements found.
          </Typography>
        ) : (
          <List>
            {announcements.map((announcement, index) => (
              <React.Fragment key={announcement.id || index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={announcement.title}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {announcement.description}
                        </Typography>
                        <br />
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          Posted on: {formatDate(announcement.date)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < announcements.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default AdminAnnouncement; 