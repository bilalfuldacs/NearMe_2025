import { useState, useCallback } from 'react';
import { eventsService, CreateEventData } from '../services/eventsService';
import { EventFormData } from './useEventForm';

interface User {
    id?: number;
    email?: string;
    username?: string;
    name?: string;
}

interface UseEventSubmitOptions {
    isEditMode: boolean;
    eventId: string | undefined;
    user: User | null;
    onSuccess: (isEdit: boolean) => void;
}

export const useEventSubmit = ({ isEditMode, eventId, user, onSuccess }: UseEventSubmitOptions) => {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const transformFormDataToApi = useCallback((formData: EventFormData): CreateEventData => {
        return {
            title: formData.title,
            description: formData.description,
            max_attendees: parseInt(formData.maxAttendance) || 0,
            start_date: formData.startDate,
            end_date: formData.endDate,
            start_time: formData.startTime,
            end_time: formData.endTime,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postal_code: formData.zip,
            organizer_id: user?.id,
            organizer_email: user?.email || '',
            organizer_username: user?.username || user?.name || '',
            images: formData.images,
        };
    }, [user]);

    const submitEvent = useCallback(async (formData: EventFormData): Promise<boolean> => {
        if (!user) {
            setError(`Please login to ${isEditMode ? 'update' : 'create'} an event`);
            return false;
        }

        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const apiData = transformFormDataToApi(formData);

            if (isEditMode && eventId) {
                await eventsService.updateEvent(parseInt(eventId), apiData);
                setSuccess('Event updated successfully! Redirecting...');
            } else {
                await eventsService.createEvent(apiData);
                setSuccess('Event created successfully!');
            }

            onSuccess(isEditMode);
            return true;
        } catch (err: any) {
            const errorMessage = err.message || `Failed to ${isEditMode ? 'update' : 'create'} event. Please try again.`;
            setError(errorMessage);
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} event:`, err);
            return false;
        } finally {
            setSaving(false);
        }
    }, [user, isEditMode, eventId, transformFormDataToApi, onSuccess]);

    const clearMessages = useCallback(() => {
        setError(null);
        setSuccess(null);
    }, []);

    return {
        saving,
        error,
        success,
        submitEvent,
        clearMessages,
    };
};

