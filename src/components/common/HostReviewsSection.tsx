import React, { useState, useContext, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Rating,
  Divider,
  Stack,
  Chip,
  Card,
  CardContent,
  Avatar,
  Grid
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { Event } from '../../store/eventsSlice';
import { formatDate } from '../../utils/dateUtils';
import { getRatingText, getRatingColor, isOwnReview } from '../../utils/reviewUtils';
import { AuthContext } from '../../auth/authContext';
import { useReviewManagement } from '../../hooks/useReviewManagement';
import EditReviewDialog from './EditReviewDialog';
import DeleteReviewDialog from './DeleteReviewDialog';
import ReviewActionsMenu, { ReviewActionsButton } from './ReviewActionsMenu';

interface HostReviewsSectionProps {
  event: Event;
}

const HostReviewsSection: React.FC<HostReviewsSectionProps> = ({ event }) => {
  const [showAllHostReviews, setShowAllHostReviews] = useState(false);
  
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const reviewManagement = useReviewManagement();
  const {
    anchorEl,
    selectedReviewId,
    editDialogOpen,
    deleteDialogOpen,
    editRating,
    editComment,
    loading,
    error,
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
  } = reviewManagement;

  const hostReviews = event.host_reviews;
  const hostAverageRating = event.host_average_rating || 0;
  const hostTotalReviews = event.host_total_reviews || 0;

  const displayedReviews = useMemo(() => {
    return showAllHostReviews ? hostReviews?.reviews || [] : (hostReviews?.reviews || []).slice(0, 3);
  }, [showAllHostReviews, hostReviews?.reviews]);

  // Only show host reviews section if we have full host reviews data (from single event view)
  if (!hostReviews || hostTotalReviews === 0) {
    return null;
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, reviewId: number) => {
    openMenu(event, reviewId);
  };

  const handleEditClick = () => {
    if (!selectedReviewId) return;
    
    const review = hostReviews?.reviews?.find((r: any) => r.id === selectedReviewId);
    if (review) {
      openEditDialog(review);
    }
  };

  const handleDeleteClick = () => {
    openDeleteDialog();
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Divider sx={{ mb: 3 }} />
      
      {/* Host Reviews Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Host Reviews
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Reviews for {event.organizer_name} from all their past events
        </Typography>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating
              value={hostAverageRating}
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
              {hostAverageRating.toFixed(1)}
            </Typography>
          </Box>
          <Chip
            label={getRatingText(hostAverageRating)}
            color={getRatingColor(hostAverageRating)}
            size="small"
            sx={{ fontWeight: 600 }}
          />
          <Typography variant="body2" color="text.secondary">
            ({hostTotalReviews} review{hostTotalReviews !== 1 ? 's' : ''} across all events)
          </Typography>
        </Stack>

        {/* Rating Distribution */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Rating Distribution
          </Typography>
          <Grid container spacing={1}>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = hostReviews.statistics.rating_distribution[rating.toString() as keyof typeof hostReviews.statistics.rating_distribution];
              const percentage = (count / hostTotalReviews) * 100;
              
              return (
                <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={rating}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ minWidth: 20 }}>
                      {rating}★
                    </Typography>
                    <Box sx={{ flex: 1, height: 8, bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
                      <Box
                        sx={{
                          height: '100%',
                          bgcolor: rating >= 4 ? 'success.main' : rating >= 3 ? 'warning.main' : 'error.main',
                          width: `${percentage}%`,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {count}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>

      {/* Host Reviews List */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Recent Reviews
        </Typography>
        
        {displayedReviews.map((review: any) => (
          <Card 
            key={review.id}
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
                  {review.reviewer_name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {review.reviewer_name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                      {isOwnReview(review, user?.id) && (
                        <ReviewActionsButton onClick={(e) => handleMenuOpen(e, review.id)} />
                      )}
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    From: {review.event_title}
                  </Typography>
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
        ))}
        
        {hostReviews.reviews.length > 3 && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              endIcon={showAllHostReviews ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setShowAllHostReviews(!showAllHostReviews)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 2,
                px: 3
              }}
            >
              {showAllHostReviews ? 'Show Less' : `Show All ${hostTotalReviews} Host Reviews`}
            </Button>
          </Box>
        )}
      </Box>

      {/* Review Actions Menu */}
      <ReviewActionsMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />

      {/* Edit Review Dialog */}
      <EditReviewDialog
        open={editDialogOpen}
        rating={editRating}
        comment={editComment}
        loading={loading}
        error={error}
        onClose={closeEditDialog}
        onSave={handleEditSubmit}
        onRatingChange={setEditRating}
        onCommentChange={setEditComment}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteReviewDialog
        open={deleteDialogOpen}
        loading={loading}
        error={error}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default HostReviewsSection;
