import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import { ArrowBack, Send } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Event } from '../store/eventsSlice';
import { AuthContext } from '../auth/authContext';

const EventRequestPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  
  const { events } = useSelector((state: RootState) => state.events);
  const [event, setEvent] = useState<Event | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (eventId && events.length > 0) {
      const foundEvent = events.find(e => e.id === parseInt(eventId));
      if (foundEvent) {
        setEvent(foundEvent);
      }
    }
  }, [eventId, events]);

  const handleBack = () => {
    navigate(-1);
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
        
        // If conversation exists, redirect to home page
        if (checkResult.exists) {
          setSuccess('You have already sent a request for this event!');
          setTimeout(() => {
            navigate('/');
          }, 2000);
          return;
        }
      }

      // If conversation doesn't exist, proceed to create it
      const requestData = {
        event_id: parseInt(eventId || '0'),
        user_id: user.id || 1,
        message: message.trim() || ''
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
      setMessage('');
      
      // Redirect back to event details after 2 seconds
      setTimeout(() => {
        navigate(`/event/${eventId}`);
      }, 2000);

    } catch (error) {
      console.error('Error sending request:', error);
      setError('Failed to send request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        backgroundColor: '#f8f9fa', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Typography>Event not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', py: 4 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ 
              mb: 2,
              textTransform: 'none',
              color: '#666'
            }}
          >
            Back to Event
          </Button>
          
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Send Request
          </Typography>
        </Box>

        {/* Event Info Card */}
        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: 1 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              {event.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Hosted by {event.organizer_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {event.city}, {event.state} • {new Date(event.start_date).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>

        {/* Request Form */}
        <Card sx={{ borderRadius: 2, boxShadow: 1 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Send a request to join this event
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You can optionally include a message to the organizer (not required)
            </Typography>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Success Alert */}
            {success && (
              <Alert severity="success" sx={{ mb: 3 }}>
                {success}
              </Alert>
            )}

            {/* Message Input */}
            <TextField
              fullWidth
              multiline
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Optional: Tell the organizer why you'd like to join this event..."
              variant="outlined"
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            {/* Character Count */}
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ display: 'block', mb: 3 }}
            >
              {message.length}/500 characters
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={loading}
                sx={{
                  textTransform: 'none',
                  px: 3,
                  py: 1.5
                }}
              >
                Cancel
              </Button>
              
              <Button
                variant="contained"
                onClick={handleSendRequest}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                sx={{
                  textTransform: 'none',
                  px: 3,
                  py: 1.5,
                  borderRadius: 2
                }}
              >
                {loading ? 'Sending...' : 'Send Request'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Info Section */}
        <Paper 
          elevation={0} 
          sx={{ 
            mt: 3, 
            p: 3, 
            backgroundColor: '#f8f9ff',
            borderRadius: 2,
            border: '1px solid #e3f2fd'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            <strong>Note:</strong> Your request will be sent to the event organizer for review. 
            They will be notified about your interest and can approve or decline your request.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default EventRequestPage;
