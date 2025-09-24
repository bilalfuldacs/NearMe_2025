import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Badge,
  Divider,
  Chip,
  Paper
} from '@mui/material';
import { ChatBubbleOutline, Circle } from '@mui/icons-material';

const dummyMessages = [
  {
    id: 1,
    senderName: 'John Doe',
    senderEmail: 'john@example.com',
    lastMessage: 'Hey! I\'m interested in joining your tech meetup event.',
    timestamp: '2 min ago',
    unreadCount: 2,
    eventTitle: 'Tech Meetup 2024',
    eventId: 1
  },
  {
    id: 2,
    senderName: 'Sarah Wilson',
    senderEmail: 'sarah@example.com',
    lastMessage: 'Thank you for the invite! What time does it start?',
    timestamp: '15 min ago',
    unreadCount: 0,
    eventTitle: 'Photography Workshop',
    eventId: 2
  },
  {
    id: 3,
    senderName: 'Mike Johnson',
    senderEmail: 'mike@example.com',
    lastMessage: 'I\'d love to attend your cooking class this weekend.',
    timestamp: '1 hour ago',
    unreadCount: 1,
    eventTitle: 'Cooking Masterclass',
    eventId: 3
  }
];

interface MessagesListProps {
  onMessageSelect: (message: any) => void;
  selectedMessageId?: number;
}

const MessagesList: React.FC<MessagesListProps> = ({ onMessageSelect, selectedMessageId }) => {
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
        backgroundColor: '#f8f9fa'
      }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
          Messages
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {dummyMessages.length} conversations
        </Typography>
      </Box>

      <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
        {dummyMessages.map((message, index) => (
          <React.Fragment key={message.id}>
            <ListItem
              onClick={() => onMessageSelect(message)}
              sx={{
                cursor: 'pointer',
                backgroundColor: selectedMessageId === message.id ? '#e3f2fd' : 'transparent',
                '&:hover': {
                  backgroundColor: selectedMessageId === message.id ? '#e3f2fd' : '#f5f5f5'
                },
                transition: 'background-color 0.2s ease'
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: '#1976d2', fontSize: '0.875rem' }}>
                  {message.senderName.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
                      {message.senderName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {message.timestamp}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {message.lastMessage}
                    </Typography>
                    <Chip
                      label={message.eventTitle}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem', height: 20 }}
                    />
                  </Box>
                }
              />
              
              {message.unreadCount > 0 && (
                <Badge badgeContent={message.unreadCount} color="primary" sx={{ ml: 1 }} />
              )}
            </ListItem>
            {index < dummyMessages.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default MessagesList;
