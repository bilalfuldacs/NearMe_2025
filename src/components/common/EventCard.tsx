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

interface EventCardProps {
  Image: string;
  event?: Event;
}

export default function MediaCard({Image, event}: EventCardProps) {
  const navigate = useNavigate();
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
          {event?.max_attendees ? 
            (remainingSpots !== null ? `${remainingSpots} / ${event.max_attendees} spots available` : `${event.max_attendees} spots total`) : 
            "Limited spots"
          }, {event?.city || "Location"}<br/>
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