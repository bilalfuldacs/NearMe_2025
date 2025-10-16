import { useState, useEffect, useCallback } from 'react';
import { conversationsService } from '../services/conversationsService';

export interface AttendeeRequest {
  conversation_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  status: 'pending' | 'confirmed' | 'rejected';
  request_date: string;
  message_count: number;
}

export interface EventInfo {
  id: number;
  title: string;
  confirmed_attendees: number;
  available_spots: number;
}

interface UseEventAttendeesOptions {
  eventId: number | null;
}

export const useEventAttendees = ({ eventId }: UseEventAttendeesOptions) => {
  const [attendees, setAttendees] = useState<AttendeeRequest[]>([]);
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendees = useCallback(async () => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch event attendees from API
      const result = await conversationsService.getEventAttendees(eventId);
      
      // Transform API response to match AttendeeRequest interface
      const transformedAttendees: AttendeeRequest[] = result.conversations.map(conv => ({
        conversation_id: conv.conversation_id,
        user_id: conv.user_id,
        user_name: conv.user_name,
        user_email: conv.user_email,
        status: conv.status,
        request_date: conv.created_at,
        message_count: conv.message_count,
      }));

      setAttendees(transformedAttendees);
      setEventInfo(result.event);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load attendees';
      setError(errorMessage);
      console.error('Failed to fetch attendees:', err);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchAttendees();
  }, [fetchAttendees]);

  const updateAttendeeStatus = useCallback((conversationId: number, newStatus: 'confirmed' | 'rejected') => {
    setAttendees(prev =>
      prev.map(attendee =>
        attendee.conversation_id === conversationId
          ? { ...attendee, status: newStatus }
          : attendee
      )
    );
  }, []);

  return {
    attendees,
    eventInfo,
    loading,
    error,
    refetch: fetchAttendees,
    updateAttendeeStatus,
  };
};

