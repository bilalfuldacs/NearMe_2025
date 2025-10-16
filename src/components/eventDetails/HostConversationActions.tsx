import React from 'react';
import {
  Box,
  Button,
  Alert,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as ConfirmIcon,
  Cancel as RejectIcon,
} from '@mui/icons-material';
import { useConversationStatus } from '../../hooks/useConversationStatus';
import { getStatusBackgroundColor, getStatusMessage, getStatusConfirmationMessage } from '../../utils';

interface HostConversationActionsProps {
  conversationId: number;
  eventId: number;
  currentStatus: 'pending' | 'confirmed' | 'rejected';
  userName: string;
  onStatusChange?: (status: 'confirmed' | 'rejected') => void;
}

const HostConversationActions: React.FC<HostConversationActionsProps> = ({
  conversationId,
  eventId,
  currentStatus,
  userName,
  onStatusChange,
}) => {
  const { updating, error, updateStatus } = useConversationStatus({
    onSuccess: (status) => {
      if (onStatusChange) {
        onStatusChange(status);
      }
    }
  });

  const handleConfirm = async () => {
    if (currentStatus === 'confirmed') return;
    
    const confirmMessage = getStatusConfirmationMessage(currentStatus, 'confirmed', userName);
    if (!window.confirm(confirmMessage)) return;
    
    await updateStatus(conversationId, 'confirmed', eventId);
  };

  const handleReject = async () => {
    if (currentStatus === 'rejected') return;
    
    const rejectMessage = getStatusConfirmationMessage(currentStatus, 'rejected', userName);
    if (!window.confirm(rejectMessage)) return;
    
    await updateStatus(conversationId, 'rejected', eventId);
  };

  return (
    <Box sx={{ backgroundColor: getStatusBackgroundColor(currentStatus), borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
      {error && (
        <Alert severity="error" sx={{ m: 2, mb: 0 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          {getStatusMessage(currentStatus, userName)}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={currentStatus === 'rejected' ? 'contained' : 'outlined'}
            color="error"
            size="small"
            startIcon={updating ? <CircularProgress size={16} color="inherit" /> : <RejectIcon />}
            onClick={handleReject}
            disabled={updating || currentStatus === 'rejected'}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              opacity: currentStatus === 'rejected' ? 1 : 0.9,
            }}
          >
            {currentStatus === 'rejected' ? 'Rejected' : 'Reject'}
          </Button>
          <Button
            variant={currentStatus === 'confirmed' ? 'contained' : 'outlined'}
            color="success"
            size="small"
            startIcon={updating ? <CircularProgress size={16} color="inherit" /> : <ConfirmIcon />}
            onClick={handleConfirm}
            disabled={updating || currentStatus === 'confirmed'}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              opacity: currentStatus === 'confirmed' ? 1 : 0.9,
            }}
          >
            {currentStatus === 'confirmed' ? 'Confirmed' : 'Confirm'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HostConversationActions;

