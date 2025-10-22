import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';
import { reviewsService } from '../../services/reviewsService';

interface ReviewFormProps {
  open: boolean;
  onClose: () => void;
  eventId: number;
  eventTitle: string;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  open,
  onClose,
  eventId,
  eventTitle,
  onReviewSubmitted
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Please write at least 10 characters for your review');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await reviewsService.createReview({
        event_id: eventId,
        rating: rating,
        comment: comment.trim()
      });

      // Reset form
      setRating(0);
      setComment('');
      
      // Close dialog and refresh reviews
      onClose();
      onReviewSubmitted();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setRating(0);
      setComment('');
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StarIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Write a Review
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Share your experience about "{eventTitle}"
        </Typography>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            How would you rate this event?
          </Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => setRating(newValue || 0)}
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
          {rating > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Below Average'}
              {rating === 3 && 'Average'}
              {rating === 4 && 'Good'}
              {rating === 5 && 'Excellent'}
            </Typography>
          )}
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Write your review"
          placeholder="Tell others about your experience at this event..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={loading}
          helperText={`${comment.length}/500 characters (minimum 10)`}
          inputProps={{ maxLength: 500 }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2
            }
          }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || rating === 0 || comment.trim().length < 10}
          startIcon={loading ? <CircularProgress size={16} /> : <StarIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            px: 3
          }}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewForm;
