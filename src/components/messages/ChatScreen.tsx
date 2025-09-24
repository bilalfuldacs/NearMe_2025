import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Divider,
  Avatar,
  Chip
} from '@mui/material';
import { Send, ArrowBack } from '@mui/icons-material';

const dummyChatMessages = [
  {
    id: 1,
    sender: 'john@example.com',
    message: 'Hey! I\'m interested in joining your tech meetup event.',
    timestamp: '10:30 AM',
    isFromCurrentUser: false
  },
  {
    id: 2,
    sender: 'you@example.com',
    message: 'Hi John! That sounds great. We\'d love to have you join us.',
    timestamp: '10:32 AM',
    isFromCurrentUser: true
  }
];

interface ChatScreenProps {
  selectedMessage: any;
  onBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ selectedMessage, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(dummyChatMessages);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'you@example.com',
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFromCurrentUser: true
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        height: '100%', 
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <IconButton onClick={onBack} sx={{ display: { xs: 'block', md: 'none' } }}>
          <ArrowBack />
        </IconButton>
        
        <Avatar sx={{ backgroundColor: '#1976d2', fontSize: '0.875rem' }}>
          {selectedMessage?.senderName?.charAt(0).toUpperCase()}
        </Avatar>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {selectedMessage?.senderName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedMessage?.eventTitle}
          </Typography>
        </Box>
        
        <Chip
          label="Event Request"
          size="small"
          color="primary"
          variant="outlined"
          sx={{ fontSize: '0.7rem' }}
        />
      </Box>

      <Box sx={{ flex: 1, overflow: 'auto', p: 2, backgroundColor: '#fafafa' }}>
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              display: 'flex',
              justifyContent: msg.isFromCurrentUser ? 'flex-end' : 'flex-start',
              mb: 2
            }}
          >
            <Box
              sx={{
                maxWidth: '70%',
                display: 'flex',
                flexDirection: msg.isFromCurrentUser ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 1
              }}
            >
              <Box>
                <Paper
                  sx={{
                    p: 1.5,
                    backgroundColor: msg.isFromCurrentUser ? '#1976d2' : 'white',
                    color: msg.isFromCurrentUser ? 'white' : 'black',
                    borderRadius: 2,
                    boxShadow: 1
                  }}
                >
                  <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                    {msg.message}
                  </Typography>
                </Paper>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '0.7rem',
                    display: 'block',
                    mt: 0.5,
                    textAlign: msg.isFromCurrentUser ? 'right' : 'left'
                  }}
                >
                  {msg.timestamp}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      <Divider />

      <Box sx={{ p: 2, backgroundColor: 'white' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            variant="outlined"
            size="small"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            sx={{
              backgroundColor: '#1976d2',
              color: 'white',
              '&:hover': { backgroundColor: '#1565c0' },
              '&:disabled': { backgroundColor: '#e0e0e0', color: '#9e9e9e' }
            }}
          >
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default ChatScreen;
