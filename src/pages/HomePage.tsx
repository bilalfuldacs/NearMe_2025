import React, { useState } from 'react';
import { Box, Typography, Container, Tabs, Tab } from '@mui/material';
import Grid from '@mui/material/Grid';
import EventThumnbnailDisplay from '../components/evnentDisplay/EventThumnbnailDisplay';
import Image1 from '../assets/360_F_254936166_5MFxlGv7PNPw4VmpuNNQxlU0K2D4f7Ya.jpg'
import Image2 from '../assets/file-20190430-136810-1mceagq.avif'
import Image3 from '../assets/download.jpeg'

interface HomePageProps {
  events?: string;
}

const HomePage: React.FC<HomePageProps> = ({ events }) => { 
  const [tabValue, setTabValue] = useState(0);

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
          
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <EventThumnbnailDisplay Image={Image1}/>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <EventThumnbnailDisplay Image={Image2}/>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <EventThumnbnailDisplay Image={Image3}/>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <EventThumnbnailDisplay Image={Image1}/>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <EventThumnbnailDisplay Image={Image2}/>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <EventThumnbnailDisplay Image={Image3}/>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
