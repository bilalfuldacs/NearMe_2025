import React, { useState, useContext } from 'react';
import {
  Box,
  Typography,
  Button,
  Rating,
  Divider,
  Stack,
  Chip,
  Collapse,
  Alert
} from '@mui/material';
import {
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { Event, Review } from '../../store/eventsSlice';
import { AuthContext } from '../../auth/authContext';
import ReviewForm from './ReviewForm';
import { canUserReviewEvent, getReviewEligibilityMessage } from '../../utils/reviewEligibility';

interface ReviewsSectionProps {
  event: Event;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({ event }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const reviews = event.reviews || [];
  const averageRating = event.average_rating || 0;
  const totalReviews = event.total_reviews || 0;
  const hostRating = event.host_rating || 0;

  // Check if user can review this event (only based on event date/time)
  const canReview = canUserReviewEvent(event, user?.id);
  const eligibilityMessage = getReviewEligibilityMessage(event, user?.id);

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    if (rating >= 3.5) return 'Good';
    if (rating >= 3.0) return 'Average';
    if (rating >= 2.0) return 'Below Average';
    return 'Poor';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.0) return 'success';
    if (rating >= 3.0) return 'warning';
    return 'error';
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Divider sx={{ mb: 3 }} />
      
      {/* Reviews Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            Reviews & Ratings
          </Typography>
          {totalReviews > 0 ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating
                  value={averageRating}
                  readOnly
                  precision={0.1}
                  size="large"
                  sx={{
                    '& .MuiRating-iconFilled': {
                      color: '#fbbf24',
                    },
                    '& .MuiRating-iconEmpty': {
                      color: '#e5e7eb',
                    }
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 600, ml: 1 }}>
                  {averageRating.toFixed(1)}
                </Typography>
              </Box>
              <Chip
                label={getRatingText(averageRating)}
                color={getRatingColor(averageRating)}
                size="small"
                sx={{ fontWeight: 600 }}
              />
              <Typography variant="body2" color="text.secondary">
                ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
              </Typography>
            </Stack>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No reviews yet
            </Typography>
          )}
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<StarIcon />}
          onClick={() => canReview ? setShowReviewForm(true) : setShowWriteReview(!showWriteReview)}
          disabled={!user}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            px: 3
          }}
        >
          {!user ? 'Login to Review' : canReview ? 'Write Review' : 'Review Info'}
        </Button>
      </Box>

      {/* Host Rating */}
      {hostRating > 0 && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Host Rating
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Rating
              value={hostRating}
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
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {hostRating.toFixed(1)} stars
            </Typography>
            <Typography variant="body2" color="text.secondary">
              - {event.organizer_name}
            </Typography>
          </Stack>
        </Box>
      )}

      {/* Review Eligibility Info (Collapsible) */}
      <Collapse in={showWriteReview && !canReview}>
        <Box sx={{ mb: 3, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Review Eligibility
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            {eligibilityMessage}
          </Alert>
          <Typography variant="body2" color="text.secondary">
            You can only review events that you have attended and that have already started.
          </Typography>
        </Box>
      </Collapse>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <Box>
          {/* {displayedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))} */}
          
          {reviews.length > 3 && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                endIcon={showAllReviews ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={() => setShowAllReviews(!showAllReviews)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 3
                }}
              >
                {showAllReviews ? 'Show Less' : `Show All ${totalReviews} Reviews`}
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <StarIcon sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No reviews yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Be the first to review this event!
          </Typography>
        </Box>
      )}

      {/* Review Form Dialog */}
      <ReviewForm
        open={showReviewForm}
        onClose={() => setShowReviewForm(false)}
        eventId={event.id}
        eventTitle={event.title}
        onReviewSubmitted={() => {
          // Refresh reviews or show success message
          setShowReviewForm(false);
          // You might want to refresh the event data here
        }}
      />
    </Box>
  );
};

export default ReviewsSection;
