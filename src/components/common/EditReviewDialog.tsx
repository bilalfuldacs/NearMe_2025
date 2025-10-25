import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Rating,
  Alert
} from '@mui/material';
import { validateReview } from '../../utils/reviewUtils';

interface EditReviewDialogProps {
  open: boolean;
  rating: number;
  comment: string;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSave: () => void;
  onRatingChange: (newValue: number) => void;
  onCommentChange: (value: string) => void;
}

const EditReviewDialog: React.FC<EditReviewDialogProps> = ({
  open,
  rating,
  comment,
  loading,
  error,
  onClose,
  onSave,
  onRatingChange,
  onCommentChange
}) => {
  const validation = validateReview(rating, comment);
  const isDisabled = loading || !validation.isValid;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Review</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Rating (Current: {rating})
          </Typography>
          <Rating
            value={rating}
            onChange={(event, newValue) => {
              onRatingChange(newValue || 0);
            }}
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
        </Box>

        <Box sx={{ mt: 3 }}>
          <TextField
            label="Comment"
            multiline
            rows={4}
            fullWidth
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Share your experience..."
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={onSave} 
          variant="contained" 
          disabled={isDisabled}
        >
          {loading ? 'Updating...' : 'Update Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditReviewDialog;
