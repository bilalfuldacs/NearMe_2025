import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Stack,
  Divider,
  Chip,
  Grid,
  Button
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  ManageAccounts as ManageIcon
} from '@mui/icons-material';
import { Event } from '../../store/eventsSlice';
import { AuthContext } from '../../auth/authContext';

interface EventDetailsProps {
  event: Event;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const [remainingSpots, setRemainingSpots] = useState<number | null>(null);

  // Fetch remaining spots for this event
  useEffect(() => {
    if (event?.id) {
      fetchRemainingSpots();
    }
  }, [event?.id]);

  const fetchRemainingSpots = async () => {
    try {
      // Fetch conversations for this event to count confirmed attendees
      const response = await fetch(`http://localhost:8000/api/conversations/event/${event?.id}/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        const conversations = data.conversations || data || [];
        const confirmedAttendees = conversations.filter((c: any) => c.status === 'confirmed').length;
        const maxAttendees = event?.max_attendees || 0;
        const remaining = Math.max(0, maxAttendees - confirmedAttendees);
        setRemainingSpots(remaining);
      }
    } catch (err) {
      console.error('Error fetching remaining spots:', err);
      // Fallback to max_attendees if fetch fails
      setRemainingSpots(event?.max_attendees || 0);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <Box>
      {/* Status Chips */}
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        {event.is_upcoming && (
          <Chip label="Upcoming" color="success" size="small" />
        )}
        {event.is_past && (
          <Chip label="Past Event" color="default" size="small" />
        )}
        {event.is_active ? (
          <Chip label="Active" color="primary" size="small" />
        ) : (
          <Chip label="Inactive" color="error" size="small" />
        )}
      </Stack>

      {/* Description */}
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Description
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.6 }}>
        {event.description}
      </Typography>

      {/* Manage Attendees Button - Only for Event Host */}
      {user?.email === event.organizer_email && (
        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ManageIcon />}
            onClick={() => navigate(`/event/${eventId}/manage-attendees`)}
            sx={{ 
              minWidth: 200,
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: 2
            }}
          >
            Manage Attendees
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
            View and manage all users who have requested to join this event
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 4 }} />

      {/* Event Info Grid */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Stack spacing={3}>
            {/* Date */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CalendarIcon color="primary" sx={{ fontSize: 24 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  Date
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatDate(event.start_date)}
                  {event.end_date !== event.start_date && ` - ${formatDate(event.end_date)}`}
                </Typography>
              </Box>
            </Box>

            {/* Time */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TimeIcon color="primary" sx={{ fontSize: 24 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  Time
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </Typography>
              </Box>
            </Box>

            {/* Host */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PersonIcon color="primary" sx={{ fontSize: 24 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  Hosted by
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {event.organizer_name}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }} >
          <Stack spacing={3}>
            {/* Location */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocationIcon color="primary" sx={{ fontSize: 24 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  Location
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {event.full_address || `${event.city}, ${event.state}`}
                </Typography>
              </Box>
            </Box>

            {/* Attendance */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PeopleIcon color="primary" sx={{ fontSize: 24 }} />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  Available Spots
                </Typography>
                <Typography 
                  variant="body1" 
                  fontWeight="medium"
                  sx={{ 
                    color: remainingSpots === 0 ? 'error.main' : 'primary.main',
                    fontWeight: 'bold'
                  }}
                >
                  {remainingSpots !== null ? 
                    `${remainingSpots} / ${event.max_attendees} spots available` : 
                    `${event.max_attendees} spots total`
                  }
                </Typography>
                {remainingSpots === 0 && (
                  <Typography variant="caption" color="error.main" sx={{ fontSize: '0.75rem' }}>
                    Event is full!
                  </Typography>
                )}
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventDetails;
