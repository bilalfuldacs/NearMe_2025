import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Rating,
  Chip
} from '@mui/material';
import { Review } from '../../store/eventsSlice';
import { formatDate } from '../../utils';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <Card 
      sx={{ 
        mb: 2,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'primary.main',
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            {review.user_name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {review.user_name}
              </Typography>
              <Chip
                label={formatDate(review.created_at)}
                size="small"
                sx={{
                  fontSize: '0.75rem',
                  height: 24,
                  bgcolor: 'grey.100',
                  color: 'text.secondary'
                }}
              />
            </Box>
            <Rating
              value={review.rating}
              readOnly
              size="small"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#fbbf24',
                },
                '& .MuiRating-iconEmpty': {
                  color: '#e5e7eb',
                }
              }}
            />
          </Box>
        </Box>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            lineHeight: 1.6,
            fontSize: '0.95rem'
          }}
        >
          {review.comment}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
