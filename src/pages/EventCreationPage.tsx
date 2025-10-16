import React, { useContext, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, Alert, CircularProgress } from '@mui/material';
import { AuthContext } from '../auth/authContext';
import EventCreation from '../components/eventCreation/EventCreation';
import { useEventForm } from '../hooks/useEventForm';
import { useEventData } from '../hooks/useEventData';
import { useEventSubmit } from '../hooks/useEventSubmit';

interface EventCreationPageProps {
    mode?: 'create' | 'edit';
}

const REDIRECT_DELAY = 1500;

const EventCreationPage: React.FC<EventCreationPageProps> = ({ mode = 'create' }) => {
    const { eventId } = useParams<{ eventId: string }>();
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const user = authContext?.user ?? null;
    
    const isEditMode = useMemo(() => mode === 'edit', [mode]);

    // Custom hooks for form management
    const {
        eventData,
        validation,
        handleInputChange,
        handleImagesChange,
        validateForm,
        resetForm,
        setFormData,
    } = useEventForm();

    // Handle unauthorized access
    const handleUnauthorized = useCallback(() => {
        setTimeout(() => navigate(`/event/${eventId}`), 2000);
    }, [navigate, eventId]);

    // Custom hook for fetching event data
    const {
        event,
        loading: loadingEvent,
        error: fetchError,
        transformEventToFormData,
    } = useEventData({
        eventId,
        isEditMode,
        userEmail: user?.email,
        onUnauthorized: handleUnauthorized,
    });

    // Handle successful submission
    const handleSuccess = useCallback((isEdit: boolean) => {
        if (isEdit && eventId) {
            setTimeout(() => {
                navigate(`/event/${eventId}`);
            }, REDIRECT_DELAY);
        } else {
            resetForm();
        }
    }, [eventId, navigate, resetForm]);

    // Custom hook for event submission
    const {
        saving,
        error: submitError,
        success,
        submitEvent,
    } = useEventSubmit({
        isEditMode,
        eventId,
        user,
        onSuccess: handleSuccess,
    });

    // Populate form with event data when editing
    useEffect(() => {
        if (event && isEditMode) {
            const formData = transformEventToFormData(event);
            setFormData(formData);
        }
    }, [event, isEditMode, transformEventToFormData, setFormData]);

    // Handle form submission
    const handleSave = useCallback(async () => {
        const isValid = validateForm();
        if (!isValid) {
            return;
        }
        await submitEvent(eventData);
    }, [validateForm, submitEvent, eventData]);

    // Combine errors
    const error = useMemo(() => fetchError || submitError, [fetchError, submitError]);

    // Show loading spinner when fetching event data in edit mode
    if (loadingEvent) {
        return (
            <Box sx={{ 
                minHeight: '100vh', 
                backgroundColor: '#f8f9fa', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#f8f9fa', py: 2 }}>
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
                        {isEditMode ? 'Edit Event' : 'Create a New Event'}
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
                        isEditMode={isEditMode}
                        loading={saving}
                    />
                </Paper>
            </Container>
  </Box>
    );
};

export default EventCreationPage;