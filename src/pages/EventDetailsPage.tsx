import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Alert,
  Card,
  TextField,
  Button,
  Paper,
  CircularProgress
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Event } from '../store/eventsSlice';
import { AuthContext } from '../auth/authContext';
import EventImageSlider from '../components/eventDetails/EventImageSlider';
import EventHeader from '../components/eventDetails/EventHeader';
import EventDetails from '../components/eventDetails/EventDetails';
import EventMap from '../components/eventDetails/EventMap';

const EventDetailsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  
  const { events } = useSelector((state: RootState) => state.events);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showChatScreen, setShowChatScreen] = useState(false);
  const [message, setMessage] = useState('');
  const [existingConversation, setExistingConversation] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  useEffect(() => {
    if (eventId && events.length > 0) {
      const foundEvent = events.find(e => e.id === parseInt(eventId));
      if (foundEvent) {
        setEvent(foundEvent);
      }
      setLoading(false);
    }
  }, [eventId, events]);

  const isOrganizer = Boolean(event && user && event.organizer_email === user.email);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log('Delete event:', eventId);
  };

  const handleSendRequest = async () => {
    if (!user) {
      setError('You must be logged in to send a request');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const checkData = {
        event_id: parseInt(eventId || '0'),
        user_id: user.id || 1
      };

      console.log('Checking if conversation exists:', checkData);

      // First, check if conversation already exists
      const checkResponse = await fetch(`http://localhost:8000/api/conversations/check/?event_id=${checkData.event_id}&user_id=${checkData.user_id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('Check response status:', checkResponse.status);

      if (checkResponse.ok) {
        const checkResult = await checkResponse.json();
        console.log('Check result:', checkResult);
        
        // If conversation exists, fetch the conversation and chat history
        if (checkResult.exists) {
          console.log('Check result conversation data:', checkResult);
          
          // Use conversation_id from check response
          const conversationId = checkResult.conversation_id || checkResult.conversation?.id;
          
          if (conversationId) {
            setExistingConversation({ id: conversationId, ...checkResult.conversation });
            
            // Fetch chat history for this conversation
            const historyResponse = await fetch(`http://localhost:8000/api/conversations/${conversationId}/messages/`, {
              method: 'GET',
              headers: {
                'Accept': 'application/json'
              }
            });
            
            console.log('History response status:', historyResponse.status);
            
            if (historyResponse.ok) {
              const historyData = await historyResponse.json();
              console.log('Chat history data:', historyData);
              const messages = historyData.messages || [];
              console.log('Messages to display:', messages);
              messages.forEach((msg: any, index: number) => {
                console.log(`Message ${index}:`, {
                  text: msg.text,
                  sender_name: msg.sender_name,
                  created_at: msg.created_at,
                  is_from_user: msg.is_from_user,
                  parsed_date: new Date(msg.created_at)
                });
              });
              setChatHistory(messages);
            } else {
              console.error('Failed to fetch chat history:', historyResponse.status);
              setChatHistory([]);
            }
          } else {
            console.error('No conversation ID found in check response:', checkResult);
            setChatHistory([]);
          }
          
          setShowChatScreen(true);
          setSuccess('You have an existing conversation for this event. You can continue the chat below.');
          return;
        }
      }

      // If conversation doesn't exist, show chat screen for user to write message
      setShowChatScreen(true);
      setSuccess('Please write your message below:');

    } catch (error) {
      console.error('Error sending request:', error);
      setError('Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!user || !message.trim()) {
      setError('Please enter a message');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (existingConversation) {
        // Send message to existing conversation
        const conversationId = existingConversation.id || existingConversation;
        const messageData = {
          conversation_id: conversationId,
          sender_id: user.id || 1,
          text: message.trim()
        };

        console.log('Sending message to existing conversation:', messageData);

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
        
        // Add the new message to chat history
        // Handle different possible response structures
        const newMessage = result.message || result;
        console.log('Adding new message to chat history:', newMessage);
        
        // Ensure the message has the required fields for display
        const formattedMessage = {
          message_id: newMessage.message_id || newMessage.id || Date.now(),
          sender_id: newMessage.sender_id || user.id || 1,
          sender_name: newMessage.sender_name || user.username || 'You',
          text: newMessage.text || newMessage.message || message.trim(),
          created_at: newMessage.created_at || new Date().toISOString(),
          is_from_user: newMessage.is_from_user !== undefined ? newMessage.is_from_user : true
        };
        
        console.log('Formatted message for display:', formattedMessage);
        setChatHistory(prev => [...prev, formattedMessage]);
        setMessage('');
        setSuccess('Message sent successfully!');
        
      } else {
        // Create new conversation
        const requestData = {
          event_id: parseInt(eventId || '0'),
          user_id: user.id || 1,
          message: message.trim()
        };

        console.log('Creating new conversation:', requestData);

        const response = await fetch('http://localhost:8000/api/conversations/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(requestData)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Request sent successfully:', result);
        
        setSuccess('Your request has been sent successfully!');
        setShowChatScreen(false);
        setMessage('');
        
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelMessage = () => {
    setShowChatScreen(false);
    setMessage('');
    setError(null);
    setSuccess(null);
    setExistingConversation(null);
    setChatHistory([]);
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8f9fa', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!event) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', py: 2 }}>
        <Container maxWidth="lg">
          <Alert severity="error">
            Event not found
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', py: 4 }}>
      <Container maxWidth="lg">
        {/* Success/Error Messages */}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Chat Screen for Writing Message */}
        {showChatScreen && (
          <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
            {/* Chat Header */}
            <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {existingConversation ? 'Continue Conversation' : 'Send Message'} to {event?.organizer_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Event: {event?.title}
              </Typography>
            </Box>

            {/* Chat History */}
            {existingConversation && chatHistory.length > 0 && (
              <Box sx={{ p: 3, backgroundColor: '#fafafa', maxHeight: '300px', overflow: 'auto' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Chat History:
                </Typography>
                {chatHistory.map((msg, index) => {
                  // Check if the message is from the current logged-in user
                  const isFromCurrentUser = msg.sender_id === user?.id || 
                                           msg.sender_name === user?.username ||
                                           msg.sender_name === user?.email ||
                                           msg.is_from_user;
                  
                  console.log('Message display check:', {
                    messageId: msg.message_id,
                    senderId: msg.sender_id,
                    senderName: msg.sender_name,
                    currentUserId: user?.id,
                    currentUserName: user?.username,
                    currentUserEmail: user?.email,
                    isFromCurrentUser: isFromCurrentUser
                  });

                  return (
                    <Box
                      key={msg.message_id || index}
                      sx={{
                        display: 'flex',
                        justifyContent: isFromCurrentUser ? 'flex-end' : 'flex-start',
                        mb: 2
                      }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          maxWidth: '70%',
                          backgroundColor: isFromCurrentUser ? '#1976d2' : 'white',
                          color: isFromCurrentUser ? 'white' : 'black',
                          borderRadius: 2,
                          boxShadow: 1
                        }}
                      >
                        <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                          {msg.text}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontSize: '0.7rem',
                            display: 'block',
                            mt: 0.5,
                            opacity: 0.7
                          }}
                        >
                          {msg.sender_name} • {new Date(msg.created_at).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Paper>
                    </Box>
                  );
                })}
              </Box>
            )}

            {/* Message Input */}
            <Box sx={{ p: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={existingConversation ? "Continue the conversation..." : "Tell the organizer why you'd like to join this event..."}
                variant="outlined"
                sx={{ mb: 3 }}
              />
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancelMessage}
                  disabled={loading}
                >
                  {existingConversation ? 'Close Chat' : 'Cancel'}
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={loading || !message.trim()}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {loading ? 'Sending...' : existingConversation ? 'Send Reply' : 'Send Message'}
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
        
        <Box sx={{ 
          backgroundColor: 'white', 
          borderRadius: 2, 
          p: 4,
          boxShadow: 1
        }}>
          {/* Image Slider Card */}
          <Card sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
            <EventImageSlider
              images={event.all_images}
              onBack={handleBack}
            />
          </Card>

          {/* Event Header */}
          <EventHeader
            event={event}
            isOrganizer={isOrganizer}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSendRequest={handleSendRequest}
          />

          {/* Event Details Card */}
          <Card sx={{ mb: 4, borderRadius: 2, p: 3 }}>
            <EventDetails event={event} />
          </Card>

          {/* Event Map Card */}
          <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <EventMap event={event} />
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default EventDetailsPage;
