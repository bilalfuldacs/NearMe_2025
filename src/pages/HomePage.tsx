import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Box, Typography, Container, Tabs, Tab, CircularProgress, Alert } from '@mui/material';
// import Grid from '@mui/material/Unstable_Grid2';
import EventCard from '../components/common/EventCard';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setEvents, setLoading, setError, Event } from '../store/eventsSlice';
import { AuthContext } from '../auth/authContext';
import Image1 from '../assets/360_F_254936166_5MFxlGv7PNPw4VmpuNNQxlU0K2D4f7Ya.jpg'
import Image2 from '../assets/file-20190430-136810-1mceagq.avif'
import Image3 from '../assets/download.jpeg'

interface HomePageProps {
  events?: string;
}

const HomePage: React.FC<HomePageProps> = ({ events }) => { 
  const [tabValue, setTabValue] = useState(0);
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  
  // Use Redux hooks directly
  const dispatch = useDispatch<AppDispatch>();
  const { events: allEvents, loading, error } = useSelector((state: RootState) => state.events);
  
  // State for confirmed events
  const [confirmedEvents, setConfirmedEvents] = useState<any[]>([]);
  const [confirmedEventsLoading, setConfirmedEventsLoading] = useState(false);

  // Fetch all events function
  const fetchAllEvents = useCallback(async () => {
    try {
      console.log('Fetching all events...');
      dispatch(setLoading(true));
      dispatch(setError(null));
      
      const response = await fetch('http://localhost:8000/api/events/');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Fetched events response:', responseData);
      
      // Handle paginated response - events are in results array
      const data: Event[] = responseData.results || responseData;
      console.log('Processed events data:', data);
      dispatch(setEvents(data));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
      console.error('Error fetching events:', err);
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
    }, [dispatch]);
  
    // Fetch confirmed events function
    const fetchConfirmedEvents = useCallback(async () => {
      if (!user?.id) return;
      
      try {
        console.log('Fetching confirmed events for user:', user.id);
        setConfirmedEventsLoading(true);
        
        const response = await fetch(`http://localhost:8000/api/conversations/user/${user.id}/confirmed-events/`);
        console.log('Confirmed events response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log('Confirmed events response:', responseData);
        
        if (responseData.success) {
          // Handle different possible response structures
          let eventsData = [];
          if (responseData.confirmed_events) {
            eventsData = responseData.confirmed_events;
          } else if (responseData.event) {
            // If it's a single event response, wrap it in an array
            eventsData = [responseData.event];
          } else if (Array.isArray(responseData)) {
            eventsData = responseData;
          }
          
          // Transform the event data to match our Event interface
          const transformedEvents = eventsData.map((event: any) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            start_date: event.start_date,
            end_date: event.end_date,
            start_time: event.start_time,
            end_time: event.end_time,
            street: event.location?.street || '',
            city: event.location?.city || '',
            state: event.location?.state || '',
            postal_code: event.location?.postal_code || '',
            max_attendees: event.max_attendees,
            organizer_name: event.organizer?.name || '',
            organizer_email: event.organizer?.email || '',
            organizer_id: event.organizer?.id,
            primary_image: event.images && event.images.length > 0 
              ? event.images.find((img: any) => img.is_primary)?.image || event.images[0]?.image
              : null,
            username: event.organizer?.name || '',
            email: event.organizer?.email || ''
          }));
          
          console.log('Processed events data for confirmed events:', transformedEvents);
          setConfirmedEvents(transformedEvents);
        } else {
          console.log('No confirmed events found or API response format different:', responseData);
          setConfirmedEvents([]);
        }
      } catch (err) {
        console.error('Error fetching confirmed events:', err);
        setConfirmedEvents([]);
      } finally {
        setConfirmedEventsLoading(false);
      }
    }, [user?.id]);
  
    // Auto-fetch all events on mount
    useEffect(() => {
      fetchAllEvents();
    }, [fetchAllEvents]);
  
    // Fetch confirmed events when user switches to Attended Events tab
    useEffect(() => {
      if (events === "my-events" && tabValue === 1 && user?.id) {
        fetchConfirmedEvents();
      }
    }, [events, tabValue, user?.id, fetchConfirmedEvents]);

  // Filter events based on page type and user
  const currentEvents = React.useMemo(() => {
    if (events === "my-events" && user?.email) {
      if (tabValue === 0) {
        // Hosted Events - show events created by this user
        return allEvents.filter(event => event.organizer_email === user.email);
      } else {
        // Attended Events - show events user is confirmed to attend
        return confirmedEvents;
      }
    }
    // For "all" events page, show all events
    return allEvents;
  }, [allEvents, events, user?.email, tabValue, confirmedEvents]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
              
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{
                  mb: 3,
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    minHeight: 48,
                    paddingX: 2,
                  },
                  '& .Mui-selected': {
                    color: 'primary.main',
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'primary.main',
                    height: 2,
                  },
                }}
              >
                <Tab label="Hosted Events" />
                <Tab label="Attended Events" />
              </Tabs>
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
              {events === "my-events" ? 
                (tabValue === 0 ? "Hosted Events" : "Attended Events") : 
                "Featured Events"
              }
            </Typography>
          
          {/* Loading State */}
          {(loading || (events === "my-events" && tabValue === 1 && confirmedEventsLoading)) && (
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
          {!loading && !error && !(events === "my-events" && tabValue === 1 && confirmedEventsLoading) && (
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
                    {events === "my-events" && tabValue === 1 ? 
                      "You haven't been confirmed for any events yet" : 
                      "No events found"
                    }
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
