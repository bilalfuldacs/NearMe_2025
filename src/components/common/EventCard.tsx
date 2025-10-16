import * as React from 'react';
import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Event } from '../../store/eventsSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setEvents } from '../../store/eventsSlice';
interface EventCardProps {
  Image: string;
  event?: Event;
}

export default function MediaCard({Image, event}: EventCardProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (event) {
      navigate(`/event/${event.id}`);
    }
  };

  return (
    <Card sx={{ 
      borderRadius: 3,
      maxWidth: 345, 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%'
    }}>
      <CardMedia
        sx={{ height: 140 }}
        image={Image}
        title={event?.title || "Event Image"}
      />
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="div"
          sx={{ 
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 1
          }}
        >
          {event?.title || "Event Title"}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
          Hosted by {event?.organizer_name || "Organizer"}<br/>
          {event?.max_attendees ? `${event.max_attendees} attendees max` : "Limited spots"}, {event?.city || "Location"}<br/>
          {event?.start_date ? new Date(event.start_date).toLocaleDateString() : "Date TBD"}
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="contained" 
          fullWidth
          onClick={handleViewDetails}
          disabled={!event}
          sx={{
            borderRadius: 5,
            py: 1.5,
            fontWeight: 'bold',
            textTransform: 'none'
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}