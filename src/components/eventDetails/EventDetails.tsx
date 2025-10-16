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
  ManageAccounts as ManageIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { Event } from '../../store/eventsSlice';
import { AuthContext } from '../../auth/authContext';
import { formatDate, formatTime } from '../../utils';

interface EventDetailsProps {
  event: Event;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;


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

      {/* Category */}
      {event.category_name && (
        <Box sx={{ mb: 3 }}>
          <Chip 
            icon={event.category_icon ? undefined : <CategoryIcon />}
            label={event.category_icon ? `${event.category_icon} ${event.category_name}` : event.category_name}
            color="primary"
            variant="outlined"
            sx={{ 
              fontSize: '0.95rem',
              fontWeight: 'bold',
              py: 2.5,
              px: 1.5,
              borderRadius: 2,
              '& .MuiChip-label': {
                px: 1
              }
            }}
          />
          {event.category_description && (
            <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary', ml: 1 }}>
              {event.category_description}
            </Typography>
          )}
        </Box>
      )}

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
              textTransform: 'none',
              fontWeight: 'bold',
              borderRadius: 2,
              px: 3,
              py: 1.5,
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
                  Attendance
                </Typography>
                <Typography 
                  variant="body1" 
                  fontWeight="medium"
                  sx={{ 
                    color: event.is_full ? 'error.main' : 'primary.main',
                    fontWeight: 'bold'
                  }}
                >
                  {event.confirmed_attendees || 0} / {event.max_attendees} attendees
                </Typography>
                {event.available_spots !== undefined && (
                  <Typography variant="caption" color="text.secondary">
                    {event.available_spots} spots available
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
