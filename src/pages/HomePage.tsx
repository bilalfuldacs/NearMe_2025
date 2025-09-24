import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Box, Typography, Container, Tabs, Tab, CircularProgress, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
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

  // Auto-fetch all events on mount
  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  // Filter events based on page type and user
  const currentEvents = React.useMemo(() => {
    if (events === "my-events" && user?.email) {
      if (tabValue === 0) {
        // Hosted Events - show events created by this user
        return allEvents.filter(event => event.organizer_email === user.email);
      } else {
        // Attended Events - show events user is attending (for now, return empty array)
        // TODO: Implement attended events logic when you have that data
        return [];
      }
    }
    // For "all" events page, show all events
    return allEvents;
  }, [allEvents, events, user?.email, tabValue]);

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
            <Grid container spacing={3}>
              {currentEvents.length > 0 ? (
                currentEvents.map((event, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id || index}>
                    <EventCard 
                      Image={event.primary_image || Image1}
                      event={event}
                    />
                  </Grid>
                ))
              ) : (
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                    No events found
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
