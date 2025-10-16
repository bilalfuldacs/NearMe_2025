import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  Badge,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import ConversationView from '../components/eventDetails/ConversationView';
import HostConversationActions from '../components/eventDetails/HostConversationActions';
import { Message, ConversationListItem, conversationsService } from '../services/conversationsService';
import { AuthContext } from '../auth/authContext';
import { getStatusColor, formatTimeAgo } from '../utils';

const MessagesPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const currentUserEmail = user?.email || '';

  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [conversationStatus, setConversationStatus] = useState<'pending' | 'confirmed' | 'rejected' | null>(null);
  const [otherPersonName, setOtherPersonName] = useState<string>('');
  const [isHost, setIsHost] = useState(false);

  // Fetch all conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await conversationsService.getMyConversations();
        setConversations(result.conversations);
      } catch (err: any) {
        console.error('Failed to fetch conversations:', err);
        setError(err.message || 'Failed to load conversations');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch messages when a conversation is selected
  const handleConversationClick = async (conversationId: number, eventId: number) => {
    setSelectedConversation(conversationId);
    setSelectedEventId(eventId);
    setLoadingMessages(true);
    setError(null);

    try {
      const result = await conversationsService.getConversationMessages(conversationId);
      setMessages(result.messages);
      setConversationStatus(result.conversation.status as 'pending' | 'confirmed' | 'rejected');
      
      // Determine if current user is the host
      const isCurrentUserHost = result.conversation.host.email === currentUserEmail;
      setIsHost(isCurrentUserHost);
      
      // Set the other person's name
      setOtherPersonName(
        isCurrentUserHost 
          ? result.conversation.user.name 
          : result.conversation.host.name
      );
    } catch (err: any) {
      console.error('Failed to fetch messages:', err);
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!selectedEventId) return;

    try {
      await conversationsService.sendMessage(selectedEventId, message);
      
      // Optimistically add message to UI
      const newMessage: Message = {
        id: Date.now(),
        conversation: selectedConversation || 0,
        sender: {
          id: user?.id || 0,
          name: user?.name || 'You',
          email: currentUserEmail,
        },
        text: message,
        created_at: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
    } catch (err: any) {
      console.error('Failed to send message:', err);
      throw err;
    }
  };

  const handleStatusChange = useCallback((status: 'confirmed' | 'rejected') => {
    // Update local state
    setConversationStatus(status);
    
    // Update conversation in list
    if (selectedConversation) {
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.conversation_id === selectedConversation
            ? { ...conv, status: status }
            : conv
        )
      );
      
      // Refresh messages to show the automatic notification message
      setTimeout(() => {
        if (selectedConversation) {
          conversationsService.getConversationMessages(selectedConversation)
            .then(result => setMessages(result.messages))
            .catch(err => console.error('Failed to refresh messages:', err));
        }
      }, 500);
    }
  }, [selectedConversation]);


  const selectedConvData = conversations.find(c => c.conversation_id === selectedConversation);

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', backgroundColor: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="xl" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 3 }}>
        {/* Page Title */}
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 'bold',
            color: 'text.primary',
            mb: 2,
          }}
        >
          Your Messages
        </Typography>

        <Paper
          elevation={2}
          sx={{
            flex: 1,
            display: 'flex',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {/* Left Column - Conversations List */}
          <Box
            sx={{
              width: { xs: '100%', md: '380px' },
              borderRight: { xs: 0, md: 1 },
              borderColor: 'divider',
              display: { xs: selectedConversation ? 'none' : 'flex', md: 'flex' },
              flexDirection: 'column',
              backgroundColor: 'white',
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2.5,
                borderBottom: 1,
                borderColor: 'divider',
                backgroundColor: 'grey.50',
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                Conversations
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {conversations.length} {conversations.length === 1 ? 'conversation' : 'conversations'}
        </Typography>
      </Box>

            {/* Loading State */}
      {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

            {/* Error State */}
            {error && !loading && (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}

            {/* Conversations List */}
      {!loading && !error && (
              <List sx={{ flex: 1, overflowY: 'auto', p: 0 }}>
                {conversations.length === 0 ? (
                  <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No conversations yet
                    </Typography>
                  </Box>
                ) : (
            conversations.map((conversation, index) => (
                    <React.Fragment key={conversation.conversation_id}>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={selectedConversation === conversation.conversation_id}
                          onClick={() => handleConversationClick(conversation.conversation_id, conversation.event.id)}
                  sx={{
                        py: 2,
                        px: 2,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.light',
                          '&:hover': {
                            backgroundColor: 'primary.light',
                          },
                        },
                  }}
                >
                  <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {conversation.other_person.name.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                                  {conversation.event.title}
                        </Typography>
                                <Chip
                                  label={conversation.status.toUpperCase()}
                                  color={getStatusColor(conversation.status)}
                                  size="small"
                                  sx={{ height: 20, fontSize: '0.65rem' }}
                                />
                      </Box>
                    }
                    secondary={
                      <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    fontSize: '0.8rem',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    mb: 0.5,
                                  }}
                                >
                                  {conversation.last_message.sender_name}: {conversation.last_message.text}
                                </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              {formatTimeAgo(conversation.last_message.created_at)}
                            </Typography>
                              </Box>
                            }
                          />
                        </ListItemButton>
                </ListItem>
                {index < conversations.length - 1 && <Divider />}
              </React.Fragment>
            ))
                )}
              </List>
            )}
          </Box>

          {/* Right Column - Conversation Detail */}
          <Box
            sx={{
              flex: 1, 
              display: { xs: !selectedConversation ? 'none' : 'flex', md: 'flex' },
              flexDirection: 'column',
              backgroundColor: 'white',
            }}
          >
            {loadingMessages ? (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
              alignItems: 'center', 
              justifyContent: 'center',
                }}
              >
                <CircularProgress />
              </Box>
            ) : selectedConvData && selectedConversation ? (
              <>
                {/* Conversation Header */}
                <Box
              sx={{ 
                    p: 2.5,
                    borderBottom: 1,
                    borderColor: 'divider',
                    backgroundColor: 'grey.50',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {/* Back button for mobile */}
                    <IconButton
                      onClick={() => setSelectedConversation(null)}
                      sx={{ display: { xs: 'flex', md: 'none' }, mt: 0.5 }}
                    >
                      <ArrowBackIcon />
                    </IconButton>

                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {selectedConvData.event.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedConvData.event.city}, {selectedConvData.event.state} • {new Date(selectedConvData.event.start_date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          with {selectedConvData.other_person.name}
                      </Typography>
                      </Box>
                      <Chip
                        label={(conversationStatus || selectedConvData.status).toUpperCase()}
                        color={getStatusColor(conversationStatus || selectedConvData.status)}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Host Actions - Always show for hosts */}
                {isHost && conversationStatus && selectedConversation && selectedEventId && (
                  <HostConversationActions
                    conversationId={selectedConversation}
                    eventId={selectedEventId}
                    currentStatus={conversationStatus}
                    userName={otherPersonName}
                    onStatusChange={handleStatusChange}
                  />
                )}

                {/* Conversation Messages */}
                <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <ConversationView
                    messages={messages}
                    currentUserEmail={currentUserEmail}
                    onSendMessage={handleSendMessage}
                  />
                </Box>
              </>
            ) : (
              <Box
                sx={{
              flex: 1, 
              display: 'flex', 
                  flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
                  gap: 2,
                  p: 4,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: 'grey.100',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h2" sx={{ color: 'grey.400' }}>
                    💬
                      </Typography>
                    </Box>
                <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                  No Conversation Selected
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  Click on a conversation from the list to start texting
                </Typography>
            </Box>
          )}
        </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default MessagesPage;

