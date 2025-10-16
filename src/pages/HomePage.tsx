import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Box, Typography, Container, Tabs, Tab, CircularProgress, Alert } from '@mui/material';
import EventCard from '../components/common/EventCard';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setEvents, setLoading, setError, Event } from '../store/eventsSlice';
import { AuthContext } from '../auth/authContext';
import { eventsService } from '../services/eventsService';
import Image1 from '../assets/360_F_254936166_5MFxlGv7PNPw4VmpuNNQxlU0K2D4f7Ya.jpg'

interface HomePageProps {
  events?: string;
}

const HomePage: React.FC<HomePageProps> = ({ events }) => { 
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  
  // Use Redux hooks directly
  const dispatch = useDispatch<AppDispatch>();
  const { events: allEvents, loading, error } = useSelector((state: RootState) => state.events);

  // Fetch all events function
  const fetchAllEvents = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      // Use events service - handles transformation automatically
      const events = await eventsService.getAllEvents();
      
      dispatch(setEvents(events));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
      console.error('HomePage: Error fetching events:', err);
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);
  
  // Auto-fetch all events on mount
  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  // Filter events based on page type and user
  const currentEvents = React.useMemo(() => {
    if (events === "my-events" && user?.email) {
      // Show events created by this user
      return allEvents.filter(event => event.organizer_email === user.email);
    }
    // For "all" events page, show all events
    return allEvents;
  }, [allEvents, events, user?.email]);

  return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa', py: 2 }}>
        <Container maxWidth="lg">
          {events === "all" && (
            <>
              <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
                Welcome to NearMe
              </Typography>
              <Typography variant="h6" textAlign="center" color="text.secondary" paragraph>
                Discover amazing events happening near you
              </Typography>
            </>
          )}
          {events === "my-events" && (
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                color: 'text.primary',
                mb: 3
              }}
            >
              My Events
            </Typography>
          )}
      
        {/* Event cards in a row */}
        <Box sx={{ 
          mt: 2, 
          p: 4, 
          backgroundColor: 'white', 
          borderRadius: 2,
          boxShadow: 1
        }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              {events === "my-events" ? "My Hosted Events" : "Featured Events"}
            </Typography>
          
          {/* Loading State */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error State */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Events Grid */}
          {!loading && !error && (
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3,
              justifyContent: 'flex-start'
            }}>
              {currentEvents.length > 0 ? (
                currentEvents.map((event, index) => {
                  return (
                    <Box 
                      key={event.id || index}
                      sx={{ 
                        width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
                        maxWidth: 345
                      }}
                    >
                      <EventCard 
                        Image={event.primary_image || Image1}
                        event={event}
                      />
                    </Box>
                  );
                })
              ) : (
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                    No events found
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
