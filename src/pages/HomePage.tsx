import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Box, Typography, Container, Tabs, Tab, CircularProgress, Alert, Paper } from '@mui/material';
import EventCard from '../components/common/EventCard';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setEvents, setLoading, setError, Event } from '../store/eventsSlice';
import { AuthContext } from '../auth/authContext';
import { eventsService } from '../services/eventsService';
import { conversationsService } from '../services/conversationsService';
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
  
  // Tab state for "my-events" page
  const [currentTab, setCurrentTab] = useState<'hosted' | 'confirmed'>('hosted');
  const [confirmedEvents, setConfirmedEvents] = useState<Event[]>([]);
  const [loadingConfirmed, setLoadingConfirmed] = useState(false);
  const [confirmedError, setConfirmedError] = useState<string | null>(null);

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

  // Fetch confirmed events (where user is attendee)
  const fetchConfirmedEvents = useCallback(async () => {
    if (!user?.email) return;
    
    setLoadingConfirmed(true);
    setConfirmedError(null);
    
    try {
      // Get all conversations where user is attendee with confirmed status
      const result = await conversationsService.getMyConversations();
      
      // Filter confirmed conversations where user is attendee (not host)
      const confirmedConversations = result.conversations.filter(
        conv => conv.status === 'confirmed' && conv.my_role === 'attendee'
      );
      
      // Extract event IDs and fetch event details
      const eventIds = confirmedConversations.map(conv => conv.event.id);
      
      // Fetch full event details for confirmed events
      const eventPromises = eventIds.map(id => eventsService.getEventById(id));
      const events = await Promise.all(eventPromises);
      
      setConfirmedEvents(events);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch confirmed events';
      console.error('HomePage: Error fetching confirmed events:', err);
      setConfirmedError(errorMessage);
    } finally {
      setLoadingConfirmed(false);
    }
  }, [user?.email]);
  
  // Fetch confirmed events when tab changes to "confirmed"
  useEffect(() => {
    if (events === "my-events" && currentTab === 'confirmed') {
      fetchConfirmedEvents();
    }
  }, [events, currentTab, fetchConfirmedEvents]);

  // Filter hosted events
  const hostedEvents = React.useMemo(() => {
    if (events === "my-events" && user?.email) {
      // Show events created by this user
      return allEvents.filter(event => event.organizer_email === user.email);
    }
    return [];
  }, [allEvents, events, user?.email]);
  
  // Filter events based on page type and tab
  const currentEvents = React.useMemo(() => {
    if (events === "my-events") {
      return currentTab === 'hosted' ? hostedEvents : confirmedEvents;
    }
    // For "all" events page, show all events
    return allEvents;
  }, [allEvents, events, currentTab, hostedEvents, confirmedEvents]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: 'hosted' | 'confirmed') => {
    setCurrentTab(newValue);
  };

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
            <>
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
              
              {/* Tabs for Hosted vs Confirmed Events */}
              <Paper elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  sx={{
                    borderBottom: 1,
                    borderColor: 'divider',
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                      minWidth: 150,
                    },
                  }}
                >
                  <Tab 
                    label="Hosted Events" 
                    value="hosted"
                    icon={<span style={{ marginRight: 8 }}>🏠</span>}
                    iconPosition="start"
                  />
                  <Tab 
                    label="Confirmed Events" 
                    value="confirmed"
                    icon={<span style={{ marginRight: 8 }}>✅</span>}
                    iconPosition="start"
                  />
                </Tabs>
              </Paper>
            </>
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
              {events === "my-events" 
                ? (currentTab === 'hosted' ? "My Hosted Events" : "Events I'm Attending") 
                : "Featured Events"}
            </Typography>
          
          {/* Loading State */}
          {(loading || (events === "my-events" && currentTab === 'confirmed' && loadingConfirmed)) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error State */}
          {(error || (events === "my-events" && currentTab === 'confirmed' && confirmedError)) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error || confirmedError}
            </Alert>
          )}

          {/* Events Grid */}
          {!loading && !loadingConfirmed && !error && !confirmedError && (
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
                    {events === "my-events" && currentTab === 'hosted' 
                      ? "You haven't created any events yet" 
                      : events === "my-events" && currentTab === 'confirmed'
                      ? "You haven't joined any events yet"
                      : "No events found"}
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
