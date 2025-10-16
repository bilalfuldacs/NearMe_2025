import { useState, useEffect, useCallback } from 'react';
import { eventsService } from '../services/eventsService';
import { Event } from '../store/eventsSlice';
import { EventFormData } from './useEventForm';

interface UseEventDataOptions {
    eventId: string | undefined;
    isEditMode: boolean;
    userEmail: string | undefined;
    onUnauthorized: () => void;
}

export const useEventData = ({ eventId, isEditMode, userEmail, onUnauthorized }: UseEventDataOptions) => {
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(isEditMode);
    const [error, setError] = useState<string | null>(null);

    const fetchEventData = useCallback(async () => {
        if (!isEditMode || !eventId) {
            setLoading(false);
            return null;
        }

        setLoading(true);
        setError(null);

        try {
            const eventData = await eventsService.getEventById(parseInt(eventId));
            
            // Check authorization
            if (userEmail && eventData.organizer_email !== userEmail) {
                setError('You are not authorized to edit this event');
                onUnauthorized();
                return null;
            }

            setEvent(eventData);
            return eventData;
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to load event details';
            setError(errorMessage);
            console.error('Failed to fetch event:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [isEditMode, eventId, userEmail, onUnauthorized]);

    useEffect(() => {
        fetchEventData();
    }, [fetchEventData]);

    const transformEventToFormData = useCallback((event: Event): EventFormData => {
        const imageUrls = event.all_images?.map(img => img.url) || [];
        
        return {
            title: event.title || '',
            description: event.description || '',
            startDate: event.start_date || '',
            endDate: event.end_date || '',
            startTime: event.start_time || '',
            endTime: event.end_time || '',
            maxAttendance: event.max_attendees?.toString() || '',
            street: event.street || '',
            city: event.city || '',
            state: event.state || '',
            zip: event.postal_code || '',
            images: imageUrls,
        };
    }, []);

    return {
        event,
        loading,
        error,
        fetchEventData,
        transformEventToFormData,
    };
};

