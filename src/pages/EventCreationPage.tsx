import React, { useState, useContext } from 'react';
import EventCreation from '../components/eventCreation/EventCreation';
import { Box, Container, Paper, Typography, Alert } from '@mui/material';
import { eventValidationFunction } from '../components/common/validationFunction';
import { AuthContext } from '../auth/authContext';

const EventCreationPage = () => {
    const authContext = useContext(AuthContext);
    const user = authContext?.user;
    const [eventData, setEventData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        maxAttendance: '',
            street: '',
            city: '',
            state: '',
            zip: '',
        images: [] as string[],
    })
    const [validation, setValidation] = useState<{[key: string]: string}>({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
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

    const handleSave = async () => {
        // Check if user is authenticated
        if (!user) {
            setError('Please login to create an event')
            return
        }
        

        // Create validation data with images as string
        const validationData = {
            ...eventData,
            images: eventData.images.join(',') // Convert array to string for validation
        }
        const validation = eventValidationFunction(validationData)
        setValidation(validation)
        console.log(validation)
        
        // Check if there are validation errors
        if (Object.keys(validation).length > 0) {
            setError('Please fix validation errors before submitting')
            return
        }
        
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            // Transform data to match API format
            const apiData = {
                title: eventData.title,
                description: eventData.description,
                max_attendees: parseInt(eventData.maxAttendance) || 0,
                start_date: eventData.startDate,
                end_date: eventData.endDate,
                start_time: eventData.startTime,
                end_time: eventData.endTime,
                street: eventData.street,
                city: eventData.city,
                state: eventData.state,
                postal_code: eventData.zip,
                organizer: 1, // You might want to get this from auth context
                organizer_email: user?.email || '',
                organizer_username: user?.username || '',
                images: eventData.images
            }

            console.log('Sending data:', apiData)

            const response = await fetch('http://localhost:8000/api/events/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(apiData)
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            console.log('Event created successfully:', result)
            setSuccess('Event created successfully!')
            
            // Reset form
            setEventData({
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                startTime: '',
                endTime: '',
                maxAttendance: '',
                street: '',
                city: '',
                state: '',
                zip: '',
                images: [],
            })

        } catch (error) {
            console.error('Error creating event:', error)
            setError('Failed to create event. Please try again.')
        } finally {
            setLoading(false)
        }
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

                    {/* Success/Error Messages */}
                    {success && (
                        <Alert severity="success" sx={{ mb: 3 }}>
                            {success}
                        </Alert>
                    )}
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <EventCreation
                        eventData={eventData}
                        handleInputChange={handleInputChange}
                        onImagesChange={handleImagesChange}
                        onSave={handleSave}
                        validation={validation}
                    />
                </Paper>
            </Container>
  </Box>
    );
};

export default EventCreationPage;