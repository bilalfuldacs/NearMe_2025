import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  Divider,
  IconButton,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import ConversationView from './ConversationView';
import HostConversationActions from './HostConversationActions';
import { Message, ConversationDetail } from '../../services/conversationsService';
import { getStatusColor } from '../../utils';

interface SendRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (message: string) => Promise<void>;
  onSendMessage?: (eventId: number, message: string) => Promise<void>;
  eventTitle: string;
  organizerName: string;
  eventId: number;
  currentUserEmail: string;
  isHost?: boolean;
  onCheckConversation?: (eventId: number) => Promise<{
    exists: boolean;
    conversation?: ConversationDetail;
    messages?: Message[];
  }>;
}

const SendRequestDialog: React.FC<SendRequestDialogProps> = ({
  open,
  onClose,
  onSubmit,
  onSendMessage,
  eventTitle,
  organizerName,
  eventId,
  currentUserEmail,
  isHost = false,
  onCheckConversation,
}) => {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingConversation, setExistingConversation] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [conversationStatus, setConversationStatus] = useState<'pending' | 'confirmed' | 'rejected' | null>(null);
  const [otherPersonName, setOtherPersonName] = useState<string>('');

  const handleStatusChange = (status: 'confirmed' | 'rejected') => {
    setConversationStatus(status);
  };

  // Check for existing conversation when dialog opens
  useEffect(() => {
    const checkExistingConversation = async () => {
      if (open && onCheckConversation) {
        setLoading(true);
        setError(null);
        try {
          const result = await onCheckConversation(eventId);
          if (result.exists && result.conversation) {
            setExistingConversation(result.conversation);
            setMessages(result.messages || []);
            setConversationStatus(result.conversation.status);
            
            // Set the other person's name
            setOtherPersonName(
              isHost 
                ? result.conversation.user.name 
                : result.conversation.host.name
            );
          } else {
            setExistingConversation(null);
            setMessages([]);
            setConversationStatus(null);
            setOtherPersonName('');
          }
        } catch (err: any) {
          console.error('Failed to check conversation:', err);
          setError(err.message || 'Failed to load conversation');
        } finally {
          setLoading(false);
        }
      }
    };

    checkExistingConversation();
  }, [open, eventId, onCheckConversation]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(message);
      setMessage('');
      onClose();
    } catch (error: any) {
      setError(error.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!onSendMessage) return;

    setSubmitting(true);
    setError(null);
    try {
      // Send message using eventId (backend handles conversation detection)
      await onSendMessage(eventId, messageText);
      
      // Add optimistic message update
      const newMessage: Message = {
        id: Date.now(),
        conversation: existingConversation?.id || 0,
        sender: {
          id: 0,
          name: existingConversation?.user.name || 'You',
          email: currentUserEmail,
        },
        text: messageText,
        created_at: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
    } catch (error: any) {
      setError(error.message || 'Failed to send message');
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting && !loading) {
      setMessage('');
      setExistingConversation(null);
      setMessages([]);
      setError(null);
      setConversationStatus(null);
      setOtherPersonName('');
      onClose();
    }
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              {existingConversation ? 'Conversation' : 'Request to Join Event'}
            </Typography>
            {existingConversation && (
              <Chip
                label={(conversationStatus || existingConversation.status).toUpperCase()}
                color={getStatusColor(conversationStatus || existingConversation.status)}
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>
          <IconButton onClick={handleClose} size="small" disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3, pb: existingConversation ? 0 : 3 }}>
        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Error Message */}
        {error && !loading && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Existing Conversation View */}
        {!loading && existingConversation ? (
          <Box>
            {/* Event Info */}
            <Box sx={{ mb: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Event
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                {eventTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hosted by <strong>{organizerName}</strong>
              </Typography>
            </Box>

            {/* Host Actions - Always show for hosts */}
            {isHost && conversationStatus && existingConversation && (
              <HostConversationActions
                conversationId={existingConversation.id}
                eventId={eventId}
                currentStatus={conversationStatus}
                userName={otherPersonName}
                onStatusChange={handleStatusChange}
              />
            )}

            {/* Conversation Messages */}
            <ConversationView
              messages={messages}
              currentUserEmail={currentUserEmail}
              onSendMessage={handleSendMessage}
              sending={submitting}
            />
          </Box>
        ) : (
          /* New Request Form */
          !loading && (
            <>
              {/* Event Info */}
              <Box sx={{ mb: 3, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Event
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {eventTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hosted by <strong>{organizerName}</strong>
                </Typography>
              </Box>

              {/* Message Input */}
              <Box>
                <Typography variant="body1" sx={{ mb: 1, fontWeight: 'medium' }}>
                  Add a message (optional)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Introduce yourself or explain why you'd like to join this event
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Hi! I'd love to join your event because..."
                  value={message}
                  onChange={handleMessageChange}
                  disabled={submitting}
                  variant="outlined"
                  inputProps={{ maxLength: 500 }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {message.length} / 500 characters
                </Typography>
              </Box>

              {/* Info Note */}
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  The organizer will review your request and respond via messages.
                </Typography>
              </Alert>
            </>
          )
        )}
      </DialogContent>

      {/* Only show actions for new request form */}
      {!loading && !existingConversation && (
        <>
          <Divider />
          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button
              onClick={handleClose}
              disabled={submitting}
              variant="outlined"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              variant="contained"
              startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              {submitting ? 'Sending...' : 'Send Request'}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default SendRequestDialog;

