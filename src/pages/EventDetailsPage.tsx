import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Alert,
  Card,
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
import SendRequestDialog from '../components/eventDetails/SendRequestDialog';
import { eventsService } from '../services/eventsService';
import { conversationsService } from '../services/conversationsService';

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
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;
      
      setLoading(true);
      try {
        // Fetch full event details from API to get images
        const eventDetails = await eventsService.getEventById(parseInt(eventId));
        setEvent(eventDetails);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch event details:', err);
        // Fallback to Redux state if API call fails
        const foundEvent = events.find(e => e.id === parseInt(eventId));
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError('Failed to load event details');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, events]);

  const isOrganizer = Boolean(event && user && event.organizer_email === user.email);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    if (!user) {
      setError('You must be logged in to delete an event');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use events service - handles JWT token and refresh automatically via interceptor
      await eventsService.deleteEvent(parseInt(eventId!));
      
      setSuccess('Event deleted successfully! Redirecting...');
      
      // Redirect to My Events page after 1.5 seconds
      setTimeout(() => {
        navigate('/my-events');
      }, 1500);

    } catch (error: any) {
      console.error('EventDetailsPage: Error deleting event:', error);
      setError(error.message || 'Failed to delete event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = () => {
    setRequestDialogOpen(true);
  };

  const handleCloseRequestDialog = () => {
    setRequestDialogOpen(false);
  };

  const handleCheckConversation = async (eventId: number) => {
    try {
      const result = await conversationsService.checkConversation(eventId);
      return result;
    } catch (error: any) {
      console.error('Failed to check conversation:', error);
      throw error;
    }
  };

  const handleSubmitRequest = async (message: string) => {
    if (!eventId) {
      setError('Event ID is missing');
      return;
    }

    try {
      // Send join request via conversations service
      const result = await conversationsService.sendJoinRequest({
        event_id: parseInt(eventId),
        message: message || "Hi! I'd like to join this event."
      });

      setSuccess('Request sent successfully! The organizer will review your request.');
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (error: any) {
      console.error('Failed to send join request:', error);
      setError(error.message || 'Failed to send request. Please try again.');
      
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleSendMessage = async (eventId: number, message: string) => {
    try {
      await conversationsService.sendMessage(eventId, message);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      throw error;
    }
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
        <CircularProgress />
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

        <Box sx={{ 
          backgroundColor: 'white', 
          borderRadius: 2, 
          p: 4,
          boxShadow: 1
        }}>
          {/* Image Slider Card */}
          <Card sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
            <EventImageSlider
              images={event.all_images || []}
              onBack={handleBack}
            />
          </Card>

          {/* Event Header */}
          <EventHeader
            event={event}
            isOrganizer={isOrganizer}
            remainingSpots={event.available_spots ?? (event.max_attendees - (event.confirmed_attendees || 0))}
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

        {/* Send Request Dialog */}
        {eventId && (
          <SendRequestDialog
            open={requestDialogOpen}
            onClose={handleCloseRequestDialog}
            onSubmit={handleSubmitRequest}
            onSendMessage={handleSendMessage}
            onCheckConversation={handleCheckConversation}
            eventTitle={event.title}
            organizerName={event.organizer_name}
            eventId={parseInt(eventId)}
            currentUserEmail={user?.email || ''}
            isHost={isOrganizer}
          />
        )}
      </Container>
    </Box>
  );
};

export default EventDetailsPage;
