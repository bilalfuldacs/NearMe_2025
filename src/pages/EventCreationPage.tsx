import React, { useState } from 'react';
import EventCreation from '../components/eventCreation/EventCreation';
import { Box, Container, Paper, Typography } from '@mui/material';

const EventCreationPage = () => {
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        images: [] as string[],
    })
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEventData({
            ...eventData,
            [event.target.name]: event.target.value
        })
        console.log(eventData)
    }

    const handleImagesChange = (images: string[]) => {
        setEventData({
            ...eventData,
            images: images
        })
        console.log('Images updated:', images)
    }

    return (
        <Box sx={{  backgroundColor: '#f8f9fa', py: 2 }}>
            <Container maxWidth="lg">
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        backgroundColor: 'white',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        textAlign="center"
                        sx={{
                            fontWeight: 'bold',
                            color: 'text.primary',
                            mb: 4
                        }}
                    >
                        Create a New Event
                    </Typography>

                    <EventCreation
                        eventData={eventData}
                        handleInputChange={handleInputChange}
                        onImagesChange={handleImagesChange}
                    />
                </Paper>
            </Container>
        </Box>
    );
};

export default EventCreationPage;