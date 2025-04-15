import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Rating,
  Chip,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAuth } from '../context/AuthContext';

function ReviewCard({ review, onEdit, onDelete }) {
  const { user } = useAuth();
  const isOwner = user && user.uid === review.userId;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card sx={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 48px 0 rgba(31, 38, 135, 0.25)',
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 2
        }}>
          <Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 'bold',
              color: 'text.primary',
              mb: 1
            }}>
              {review.userName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={review.rating} readOnly precision={0.5} />
              <Chip
                icon={<AccessTimeIcon sx={{ fontSize: '16px' }} />}
                label={formatDate(review.date)}
                size="small"
                variant="outlined"
                sx={{ ml: 1 }}
              />
            </Box>
          </Box>

          {isOwner && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={() => onEdit(review)}
                size="small"
                sx={{
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  }
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => onDelete(review.id)}
                size="small"
                sx={{
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.1)',
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body1" sx={{ 
          color: 'text.secondary',
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap'
        }}>
          {review.review}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ReviewCard; 