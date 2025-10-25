import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert
} from '@mui/material';

interface DeleteReviewDialogProps {
  open: boolean;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteReviewDialog: React.FC<DeleteReviewDialogProps> = ({
  open,
  loading,
  error,
  onClose,
  onConfirm
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Review</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography>
          Are you sure you want to delete this review? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color="error"
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteReviewDialog;
