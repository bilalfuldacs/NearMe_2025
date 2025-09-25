import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Divider,
  Chip,
  Paper,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { Send, ArrowBack, ChatBubbleOutline } from '@mui/icons-material';
import { AuthContext } from '../auth/authContext';

// Interface for conversation data
interface Conversation {
  id: number;
  event: number;
  event_title: string;
  user: number;
  user_name: string;
  host: number;
  host_name: string;
  created_at: string;
  updated_at: string;
  status?: string; // "pending", "confirmed", "rejected"
  last_message?: {
    id: number;
    text: string;
    sender_name: string;
    created_at: string;
  };
  message_count: number;
}

// Interface for message data
interface Message {
  message_id: number;
  sender_id: number;
  sender_name: string;
  text: string;
  created_at: string;
  is_from_user: boolean;
}

// MessagesList Component
const MessagesList: React.FC<{ 
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  onConversationSelect: (conversation: Conversation) => void;
  selectedConversationId?: number | undefined;
}> = ({ conversations, loading, error, onConversationSelect, selectedConversationId }) => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getOtherUserName = (conversation: Conversation) => {
    if (user?.id === conversation.host) {
      return conversation.user_name;
    } else {
      return conversation.host_name;
    }
  };

  return (
    <Paper elevation={1} sx={{ height: '100%', borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>Messages</Typography>
        <Typography variant="body2" color="text.secondary">
          {loading ? 'Loading...' : `${conversations.length} conversations`}
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
          {conversations.length > 0 ? (
            conversations.map((conversation, index) => (
              <React.Fragment key={conversation.id}>
                <ListItem
                  onClick={() => onConversationSelect(conversation)}
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: selectedConversationId === conversation.id ? '#e3f2fd' : 'transparent',
                    '&:hover': { backgroundColor: selectedConversationId === conversation.id ? '#e3f2fd' : '#f5f5f5' },
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ backgroundColor: '#1976d2', fontSize: '0.875rem' }}>
                      {getOtherUserName(conversation).charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#333' }}>
                          {getOtherUserName(conversation)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          {conversation.last_message?.created_at ? formatTimeAgo(conversation.last_message.created_at) : ''}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {conversation.last_message?.text || 'No messages yet'}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                          <Chip 
                            label={conversation.event_title} 
                            size="small" 
                            variant="outlined" 
                            sx={{ fontSize: '0.7rem', height: 20 }} 
                          />
                          <Chip 
                            label={conversation.status || 'pending'}
                            size="small" 
                            color={
                              conversation.status === 'confirmed' ? 'success' :
                              conversation.status === 'rejected' ? 'error' : 'default'
                            }
                            variant="filled"
                            sx={{ 
                              fontSize: '0.65rem', 
                              height: 18,
                              fontWeight: 'bold'
                            }} 
                          />
                        </Box>
                      </Box>
                    }
                  />
                  {conversation.message_count && conversation.message_count > 0 && (
                    <Badge badgeContent={conversation.message_count} color="primary" sx={{ ml: 1 }} />
                  )}
                </ListItem>
                {index < conversations.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              p: 4,
              color: 'text.secondary'
            }}>
              <ChatBubbleOutline sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" gutterBottom>
                No conversations yet
              </Typography>
              <Typography variant="body2" textAlign="center">
                When people request to join your events, their messages will appear here.
              </Typography>
            </Box>
          )}
        </List>
      )}
    </Paper>
  );
};

// ChatScreen Component
const ChatScreen: React.FC<{ 
  selectedConversation: Conversation; 
  onBack: () => void;
}> = ({ selectedConversation, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  // Fetch messages for the selected conversation
  useEffect(() => {
    if (selectedConversation && selectedConversation.id) {
      fetchMessages();
    }
  }, [selectedConversation]);

  // Type guard to ensure selectedConversation is valid
  if (!selectedConversation || !selectedConversation.id) {
    return (
      <Paper elevation={1} sx={{ height: '100%', borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="h6">No conversation selected</Typography>
        </Box>
      </Paper>
    );
  }

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8000/api/conversations/${selectedConversation.id}/messages/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched messages for conversation:', data);
      
      const messagesData = data.messages || [];
      setMessages(messagesData);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.id) return;

    try {
      setLoading(true);
      
      const messageData = {
        conversation_id: selectedConversation.id,
        sender_id: user.id,
        text: newMessage.trim()
      };

      const response = await fetch('http://localhost:8000/api/messages/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Message sent successfully:', result);

      // Add the new message to the messages list
      const newMessageObj = result.message || result;
      const formattedMessage: Message = {
        message_id: newMessageObj.message_id || newMessageObj.id || Date.now(),
        sender_id: newMessageObj.sender_id || user.id,
        sender_name: newMessageObj.sender_name || user.username || 'You',
        text: newMessageObj.text || newMessageObj.message || newMessage.trim(),
        created_at: newMessageObj.created_at || new Date().toISOString(),
        is_from_user: newMessageObj.is_from_user !== undefined ? newMessageObj.is_from_user : true
      };

      setMessages(prev => [...prev, formattedMessage]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmParticipation = async () => {
    try {
      setLoading(true);
      
      // Update conversation status to confirmed
      const response = await fetch(`http://localhost:8000/api/conversations/${selectedConversation.id}/status/`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          status: 'confirmed'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Participation confirmed:', result);

      // Update local conversation status
      selectedConversation.status = 'confirmed';

      // Add a system message about participation confirmation
      const systemMessage = `${user?.username} confirmed participation for this event.`;
      
      const messageData = {
        conversation_id: selectedConversation.id,
        sender_id: user?.id,
        text: systemMessage
      };

      const messageResponse = await fetch('http://localhost:8000/api/messages/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify(messageData)
      });

      if (messageResponse.ok) {
        const messageResult = await messageResponse.json();
        
        // Add the confirmation message to the chat
        const formattedMessage: Message = {
          message_id: messageResult.message_id || messageResult.id || Date.now(),
          sender_id: messageResult.sender_id || user?.id || 0,
          sender_name: messageResult.sender_name || user?.username || 'You',
          text: systemMessage,
          created_at: messageResult.created_at || new Date().toISOString(),
          is_from_user: true
        };

        setMessages(prev => [...prev, formattedMessage]);
      }
    } catch (err) {
      console.error('Error confirming participation:', err);
      setError(err instanceof Error ? err.message : 'Failed to confirm participation');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectParticipation = async () => {
    try {
      setLoading(true);
      
      // Update conversation status to rejected
      const response = await fetch(`http://localhost:8000/api/conversations/${selectedConversation.id}/status/`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          status: 'rejected'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Participation rejected:', result);

      // Update local conversation status
      selectedConversation.status = 'rejected';

      // Add a system message about participation rejection
      const systemMessage = `${user?.username} rejected participation for this event.`;
      
      const messageData = {
        conversation_id: selectedConversation.id,
        sender_id: user?.id,
        text: systemMessage
      };

      const messageResponse = await fetch('http://localhost:8000/api/messages/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify(messageData)
      });

      if (messageResponse.ok) {
        const messageResult = await messageResponse.json();
        
        // Add the rejection message to the chat
        const formattedMessage: Message = {
          message_id: messageResult.message_id || messageResult.id || Date.now(),
          sender_id: messageResult.sender_id || user?.id || 0,
          sender_name: messageResult.sender_name || user?.username || 'You',
          text: systemMessage,
          created_at: messageResult.created_at || new Date().toISOString(),
          is_from_user: true
        };

        setMessages(prev => [...prev, formattedMessage]);
      }
    } catch (err) {
      console.error('Error rejecting participation:', err);
      setError(err instanceof Error ? err.message : 'Failed to reject participation');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Paper elevation={1} sx={{ height: '100%', borderRadius: 2, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={onBack} sx={{ display: { xs: 'block', md: 'none' } }}>
          <ArrowBack />
        </IconButton>
        <Avatar sx={{ backgroundColor: '#1976d2', fontSize: '0.875rem' }}>
          {user?.id === selectedConversation.host ? selectedConversation.user_name?.charAt(0).toUpperCase() : selectedConversation.host_name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user?.id === selectedConversation.host ? selectedConversation.user_name : selectedConversation.host_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedConversation.event_title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Chip label="Event Request" size="small" color="primary" variant="outlined" sx={{ fontSize: '0.7rem' }} />
          <Chip 
            label={`Status: ${selectedConversation.status || 'pending'}`}
            size="small" 
            color={
              selectedConversation.status === 'confirmed' ? 'success' :
              selectedConversation.status === 'rejected' ? 'error' : 'default'
            }
            variant="filled"
            sx={{ 
              fontSize: '0.7rem',
              fontWeight: 'bold'
            }} 
          />
        </Box>
      </Box>

      {/* Participation Action Buttons - Only for Host */}
      {user?.id === selectedConversation.host && (
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', color: '#333' }}>
            Participation Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={handleConfirmParticipation}
              disabled={loading}
              sx={{ 
                textTransform: 'none',
                borderRadius: 2,
                px: 3
              }}
            >
              {loading ? 'Confirming...' : 'Confirm Participation'}
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleRejectParticipation}
              disabled={loading}
              sx={{ 
                textTransform: 'none',
                borderRadius: 2,
                px: 3
              }}
            >
              {loading ? 'Rejecting...' : 'Reject Participation'}
            </Button>
          </Box>
        </Box>
      )}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && (
        <Box sx={{ flex: 1, overflow: 'auto', p: 2, backgroundColor: '#fafafa' }}>
          {messages.length > 0 ? (
            messages.map((msg) => {
              const isFromUser = msg.sender_id === user?.id || 
                               msg.sender_name === user?.username ||
                               msg.sender_name === user?.email ||
                               msg.is_from_user;
              
              return (
                <Box key={msg.message_id} sx={{ display: 'flex', justifyContent: isFromUser ? 'flex-end' : 'flex-start', mb: 2 }}>
                  <Box sx={{ maxWidth: '70%', display: 'flex', flexDirection: isFromUser ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 1 }}>
                    <Box>
                      <Paper sx={{ 
                        p: 1.5, 
                        backgroundColor: isFromUser ? '#1976d2' : 'white', 
                        color: isFromUser ? 'white' : 'black', 
                        borderRadius: 2, 
                        boxShadow: 1 
                      }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.4 }}>{msg.text}</Typography>
                      </Paper>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', display: 'block', mt: 0.5, textAlign: isFromUser ? 'right' : 'left' }}>
                        {msg.sender_name} • {new Date(msg.created_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'text.secondary'
            }}>
              <Typography variant="body1">
                No messages yet. Start the conversation!
              </Typography>
            </Box>
          )}
        </Box>
      )}
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
            disabled={!newMessage.trim() || loading}
            sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#1565c0' }, '&:disabled': { backgroundColor: '#e0e0e0', color: '#9e9e9e' } }}
          >
            <Send />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

const MessagesPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  // Fetch conversations on component mount
  useEffect(() => {
    if (user?.id) {
      fetchConversations();
    }
  }, [user?.id]);

  // Auto-select conversation from URL parameter
  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId && conversations.length > 0) {
      const conversation = conversations.find(conv => conv.id.toString() === conversationId);
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }
  }, [conversations, searchParams]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8000/api/conversations/user/${user?.id}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched conversations:', data);
      
      // Handle the API response structure
      const conversationsData = data.conversations || [];
      setConversations(conversationsData);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  // Helper function to get conversation ID safely
  const getSelectedConversationId = (): number | undefined => {
    return selectedConversation?.id;
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', py: 3 }}>
      <Container maxWidth="lg">
        {/* Page Header */}
        <Box sx={{ mb: 3 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Messages
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage conversations and event requests
          </Typography>
        </Box>

        {/* Messages Layout */}
        <Box sx={{ 
          backgroundColor: 'white', 
          borderRadius: 2, 
          boxShadow: 1,
          overflow: 'hidden',
          height: 'calc(100vh - 200px)',
          minHeight: '600px'
        }}>
          {isMobile ? (
            // Mobile Layout - Single Column
            <Box sx={{ height: '100%' }}>
              {selectedConversation && selectedConversation.id ? (
                <ChatScreen 
                  selectedConversation={selectedConversation} 
                  onBack={handleBackToList}
                />
              ) : (
                <MessagesList 
                  conversations={conversations}
                  loading={loading}
                  error={error}
                  onConversationSelect={handleConversationSelect}
                  selectedConversationId={getSelectedConversationId()}
                />
              )}
            </Box>
          ) : (
            // Desktop Layout - Two Columns
            <Box sx={{ display: 'flex', height: '100%' }}>
              {/* Messages List - 30% width */}
              <Box sx={{ 
                width: '30%', 
                height: '100%', 
                borderRight: '1px solid #e0e0e0' 
              }}>
                <MessagesList 
                  conversations={conversations}
                  loading={loading}
                  error={error}
                  onConversationSelect={handleConversationSelect}
                  selectedConversationId={getSelectedConversationId()}
                />
              </Box>
              
              {/* Chat Screen - 70% width */}
              <Box sx={{ width: '70%', height: '100%' }}>
                {selectedConversation && selectedConversation.id ? (
                  <ChatScreen 
                    selectedConversation={selectedConversation} 
                    onBack={handleBackToList}
                  />
                ) : (
                  <Box sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: '#fafafa'
                  }}>
                    <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                      <Typography variant="h6" gutterBottom>
                        Select a conversation
                      </Typography>
                      <Typography variant="body2">
                        Choose a conversation from the list to start chatting
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default MessagesPage;