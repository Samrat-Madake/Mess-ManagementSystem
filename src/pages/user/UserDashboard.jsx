import React from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  Box
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PaymentIcon from '@mui/icons-material/Payment';

const UserDashboard = () => {
  const cards = [
    {
      title: 'View Dishes',
      description: 'Browse through our available dishes and their prices.',
      icon: <RestaurantIcon />,
      path: '/user/dishes'
    },
    {
      title: 'View Packages',
      description: 'Explore our meal packages and subscription options.',
      icon: <LocalOfferIcon />,
      path: '/user/packages'
    },
    {
      title: 'Reviews',
      description: 'Share your feedback and view other reviews.',
      icon: <RateReviewIcon />,
      path: '/user/reviews'
    },
    {
      title: 'Announcements',
      description: 'Stay updated with the latest announcements.',
      icon: <AnnouncementIcon />,
      path: '/user/announcements'
    },
    {
      title: 'Meal Skip',
      description: 'Manage your meal skip requests.',
      icon: <EventNoteIcon />,
      path: '/user/meal-skip'
    },
    {
      title: 'Payment',
      description: 'Make payments and view payment history.',
      icon: <PaymentIcon />,
      path: '/user/payment'
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom component="h1" sx={{ 
        color: 'text.primary',
        fontWeight: 'bold',
        mb: 4
      }}>
        Welcome to Your Dashboard
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ 
        color: 'text.secondary',
        mb: 6,
        fontSize: '1.1rem'
      }}>
        Access all your services and manage your account from one place.
      </Typography>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        },
        gap: 4
      }}>
        {cards.map((card, index) => (
          <Card key={index} sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            borderRadius: '16px',
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.2)',
            }
          }}>
            <CardContent sx={{ 
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              p: 4
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mb: 3,
                p: 2,
                borderRadius: '50%',
                background: 'rgba(25, 118, 210, 0.1)'
              }}>
                {React.cloneElement(card.icon, { 
                  sx: { 
                    fontSize: 40, 
                    color: 'primary.main',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }
                })}
              </Box>
              <Typography gutterBottom variant="h5" component="h2" sx={{ 
                fontWeight: 'bold',
                color: 'text.primary',
                mb: 2
              }}>
                {card.title}
              </Typography>
              <Typography sx={{ 
                color: 'text.secondary',
                mb: 3,
                lineHeight: 1.6
              }}>
                {card.description}
              </Typography>
              <Button 
                component={Link} 
                to={card.path}
                variant="contained" 
                sx={{ 
                  mt: 'auto',
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .2)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0 30%, #1e88e5 90%)',
                  }
                }}
              >
                {`View ${card.title}`}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default UserDashboard; 