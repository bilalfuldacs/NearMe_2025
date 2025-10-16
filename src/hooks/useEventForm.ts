import { useState, useCallback } from 'react';
import { eventValidationFunction } from '../components/common/validationFunction';

export interface EventFormData {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    maxAttendance: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    category: string;
    images: string[];
}

export const INITIAL_EVENT_DATA: EventFormData = {
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
    category: '',
    images: [],
};

export const useEventForm = (initialData: EventFormData = INITIAL_EVENT_DATA) => {
    const [eventData, setEventData] = useState<EventFormData>(initialData);
    const [validation, setValidation] = useState<{ [key: string]: string }>({});

    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEventData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleImagesChange = useCallback((images: string[]) => {
        setEventData(prev => ({
            ...prev,
            images
        }));
    }, []);

    const validateForm = useCallback((): boolean => {
        const validationData = {
            ...eventData,
            images: eventData.images.join(',')
        };
        const errors = eventValidationFunction(validationData);
        setValidation(errors);
        return Object.keys(errors).length === 0;
    }, [eventData]);

    const resetForm = useCallback(() => {
        setEventData(INITIAL_EVENT_DATA);
        setValidation({});
    }, []);

    const setFormData = useCallback((data: EventFormData) => {
        setEventData(data);
        setValidation({});
    }, []);

    return {
        eventData,
        validation,
        handleInputChange,
        handleImagesChange,
        validateForm,
        resetForm,
        setFormData,
    };
};

