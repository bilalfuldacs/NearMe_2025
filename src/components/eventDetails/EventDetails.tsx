import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Divider,
  Chip,
  Grid
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { Event } from '../../store/eventsSlice';

interface EventDetailsProps {
  event: Event;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
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
                <Typography variant="body1" fontWeight="medium">
                  0 / {event.max_attendees} spots
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventDetails;
