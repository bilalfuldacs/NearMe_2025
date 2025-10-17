import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  Chip,
  Avatar,
  Button,
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { Message } from '../../services/conversationsService';
import { formatMessageTime, getDateLabel } from '../../utils';

interface ConversationViewProps {
  messages: Message[];
  currentUserEmail: string;
  onSendMessage: (message: string) => Promise<void>;
  sending?: boolean;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  messages,
  currentUserEmail,
  onSendMessage,
  sending = false,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    try {
      await onSendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };



  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      flex: 1, 
      minHeight: 0,
      height: '100%',
      maxHeight: '100%'
    }}>
      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          backgroundColor: 'grey.50',
          minHeight: 0,
          maxHeight: 'calc(100% - 80px)', // Reserve space for input
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.sender.email === currentUserEmail;
            const showDateDivider =
              index === 0 ||
              getDateLabel(messages[index - 1].created_at) !== getDateLabel(message.created_at);

            return (
              <React.Fragment key={message.id}>
                {showDateDivider && (
                  <Box sx={{ textAlign: 'center', my: 2 }}>
                    <Chip
                      label={getDateLabel(message.created_at)}
                      size="small"
                      sx={{ backgroundColor: 'white' }}
                    />
                  </Box>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: isCurrentUser ? 'row-reverse' : 'row',
                      gap: 1,
                      alignItems: 'flex-end',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: isCurrentUser ? 'primary.main' : 'secondary.main',
                        fontSize: '0.875rem',
                      }}
                    >
                      {message.sender.name.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mb: 0.5,
                          px: 1,
                          color: 'text.secondary',
                          textAlign: isCurrentUser ? 'right' : 'left',
                        }}
                      >
                        {message.sender.name}
                      </Typography>

                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          backgroundColor: isCurrentUser ? 'primary.main' : 'white',
                          color: isCurrentUser ? 'white' : 'text.primary',
                          borderRadius: 2,
                          borderTopRightRadius: isCurrentUser ? 0 : 2,
                          borderTopLeftRadius: isCurrentUser ? 2 : 0,
                        }}
                      >
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {message.text}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 0.5,
                            opacity: 0.8,
                            fontSize: '0.7rem',
                          }}
                        >
                          {formatMessageTime(message.created_at)}
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                </Box>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          backgroundColor: 'white',
          borderTop: 1,
          borderColor: 'divider',
          position: 'relative',
          zIndex: 1, // Ensure input area is above other content
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                fontSize: { xs: '16px', sm: '14px' }, // Prevents zoom on iOS
              },
              '& .MuiInputBase-input': {
                fontSize: { xs: '16px', sm: '14px' },
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            sx={{
              minWidth: { xs: 56, sm: 48 },
              minHeight: { xs: 56, sm: 48 },
              px: { xs: 2, sm: 1 },
              borderRadius: 3,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
                backgroundColor: 'primary.dark',
              },
              '&:active': {
                transform: 'scale(0.95)',
                backgroundColor: 'primary.dark',
              },
              '&:disabled': {
                backgroundColor: 'grey.300',
                color: 'grey.500',
                transform: 'none',
              },
              // Better touch target for mobile
              '@media (max-width: 600px)': {
                minWidth: 56,
                minHeight: 56,
                px: 2,
                py: 1,
              }
            }}
          >
            <SendIcon fontSize="small" sx={{ ml: 0.5 }} />
          </Button>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Press Enter to send, Shift+Enter for new line
        </Typography>
      </Box>
    </Box>
  );
};

export default ConversationView;

