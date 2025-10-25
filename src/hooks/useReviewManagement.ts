import { useState, useCallback } from 'react';
import { reviewsService } from '../services/reviewsService';
import { validateReview } from '../utils/reviewUtils';

export const useReviewManagement = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openMenu = useCallback((event: React.MouseEvent<HTMLElement>, reviewId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedReviewId(reviewId);
  }, []);

  const closeMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const openEditDialog = useCallback((review: any) => {
    setEditRating(Number(review.rating) || 0);
    setEditComment(review.comment || '');
    setEditDialogOpen(true);
    setAnchorEl(null);
  }, []);

  const closeEditDialog = useCallback(() => {
    setEditDialogOpen(false);
    setEditRating(0);
    setEditComment('');
    setError(null);
  }, []);

  const openDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(true);
    setAnchorEl(null);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setDeleteDialogOpen(false);
    setSelectedReviewId(null);
    setError(null);
  }, []);

  const handleEditSubmit = useCallback(async () => {
    if (!selectedReviewId) {
      setError('No review selected. Please try again.');
      return;
    }

    const validation = validateReview(editRating, editComment);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid review data');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await reviewsService.updateReview(selectedReviewId, {
        rating: editRating,
        comment: editComment.trim()
      });

      closeEditDialog();
      setSelectedReviewId(null);
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to update review');
    } finally {
      setLoading(false);
    }
  }, [selectedReviewId, editRating, editComment, closeEditDialog]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedReviewId) {
      setError('No review selected for deletion');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await reviewsService.deleteReview(selectedReviewId);
      closeDeleteDialog();
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete review');
    } finally {
      setLoading(false);
    }
  }, [selectedReviewId, closeDeleteDialog]);

  return {
    // State
    anchorEl,
    selectedReviewId,
    editDialogOpen,
    deleteDialogOpen,
    editRating,
    editComment,
    loading,
    error,
    
    // Actions
    openMenu,
    closeMenu,
    openEditDialog,
    closeEditDialog,
    openDeleteDialog,
    closeDeleteDialog,
    handleEditSubmit,
    handleDeleteConfirm,
    setEditRating,
    setEditComment,
    setError
  };
};
