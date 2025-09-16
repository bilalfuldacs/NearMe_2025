import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function MediaCard({Image}: {Image: string}) {
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
        title="Event Image"
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
          Dinner at My Place
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
          Hosted by Sarah<br/>
          3 / 3 spots, KFT WF<br/>
          500 m away
        </Typography>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="contained" 
          fullWidth
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
