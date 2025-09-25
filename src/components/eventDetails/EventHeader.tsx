import React from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Send as SendIcon,
  Block as BlockIcon
} from '@mui/icons-material';
import { Event } from '../../store/eventsSlice';

interface EventHeaderProps {
  event: Event;
  isOrganizer: boolean;
  remainingSpots: number | null;
  onEdit: () => void;
  onDelete: () => void;
  onSendRequest: () => void;
}

const EventHeader: React.FC<EventHeaderProps> = ({
  event,
  isOrganizer,
  remainingSpots,
  onEdit,
  onDelete,
  onSendRequest
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: 2,
      mb: 4
    }}>
      {/* Title */}
      <Box sx={{ flex: 1, minWidth: isMobile ? '100%' : '300px' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            color: 'text.primary',
            mb: 1,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          {event.title}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        flexWrap: 'wrap',
        justifyContent: isMobile ? 'center' : 'flex-end',
        width: isMobile ? '100%' : 'auto'
      }}>
        {isOrganizer ? (
          <>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={onEdit}
              sx={{ 
                borderRadius: 2,
                minWidth: '120px'
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={onDelete}
              sx={{ 
                borderRadius: 2,
                minWidth: '120px'
              }}
            >
              Delete
            </Button>
          </>
        ) : (
          remainingSpots === 0 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                backgroundColor: 'error.light',
                color: 'error.contrastText',
                borderRadius: 2,
                minWidth: '150px',
                justifyContent: 'center',
                border: '1px solid',
                borderColor: 'error.main'
              }}
            >
              <BlockIcon sx={{ fontSize: 20 }} />
              <Typography variant="button" sx={{ fontWeight: 'bold' }}>
                Capacity Full
              </Typography>
            </Box>
          ) : (
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={onSendRequest}
              sx={{ 
                borderRadius: 2,
                minWidth: '150px'
              }}
            >
              Send Request
            </Button>
          )
        )}
      </Box>
    </Box>
  );
};

export default EventHeader;
