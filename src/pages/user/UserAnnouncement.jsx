import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Container, CircularProgress } from '@mui/material';
import { getAnnouncements } from '../../services/announcementService';

const UserAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatDate = (timestamp) => {
    if (!timestamp || !timestamp.toDate) {
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

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const data = await getAnnouncements();
        setAnnouncements(data || []);
        setError('');
      } catch (err) {
        console.error('Error fetching announcements:', err);
        setError('Failed to load announcements. Please try again later.');
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 4 }}>
        Announcements
      </Typography>

      {error && (
        <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'error.light' }}>
          <Typography color="error">
            {error}
          </Typography>
        </Paper>
      )}

      {announcements.length === 0 ? (
        <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No announcements available at this time.
          </Typography>
        </Paper>
      ) : (
        announcements.map((announcement) => (
          <Paper
            key={announcement.id}
            elevation={2}
            sx={{
              p: 3,
              mb: 3,
              '&:hover': {
                boxShadow: 4
              }
            }}
          >
            <Typography variant="h6" gutterBottom color="primary">
              {announcement.title}
            </Typography>
            <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
              {announcement.description}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Posted on: {formatDate(announcement.date)}
            </Typography>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default UserAnnouncement; 