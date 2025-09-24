import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { Event } from '../../store/eventsSlice';

interface EventMapProps {
  event: Event;
}

const EventMap: React.FC<EventMapProps> = ({ event }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // For now, we'll show a placeholder map
  // In a real application, you would integrate with Google Maps, Mapbox, etc.
  const generateMapUrl = () => {
    const address = event.full_address || `${event.city}, ${event.state}`;
    const encodedAddress = encodeURIComponent(address);
    return `https://maps.google.com/maps?q=${encodedAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <Box sx={{ position: 'relative' }}>
        {/* Map Placeholder */}
        <Box sx={{
          height: isMobile ? '200px' : '300px',
          backgroundColor: '#e3f2fd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Map iframe - you can replace this with actual map integration */}
          <iframe
            src={generateMapUrl()}
            width="100%"
            height="100%"
            style={{
              border: 0,
              filter: 'grayscale(100%)'
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map showing location of ${event.title}`}
          />
          
          {/* Map Pin Overlay */}
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2
          }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'error.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
                '100%': { transform: 'scale(1)' }
              },
              animation: 'pulse 2s infinite'
            }}>
              <LocationIcon sx={{ color: 'white', fontSize: 20 }} />
            </Box>
          </Box>
        </Box>

        {/* Location Info */}
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <LocationIcon color="primary" sx={{ mt: 0.5 }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                Event Location
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {event.full_address || `${event.city}, ${event.state}`}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.875rem' }}>
                Click on the map to view in Google Maps
              </Typography>
            </Box>
          </Box>
        </CardContent>
    </Box>
  );
};

export default EventMap;
