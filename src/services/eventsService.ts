// Events Service
// Handles all event-related API calls

import apiClient, { apiClientNoAuth } from './apiClient';
import { Event } from '../store/eventsSlice';

export interface CreateEventData {
  title: string;
  description: string;
  max_attendees: number;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  organizer_id?: number;
  organizer_email: string;
  organizer_username?: string;
  images?: string[];
}

export interface UpdateEventData extends Partial<CreateEventData> {}

/**
 * Transform raw API event data to match Event interface
 */
const transformEvent = (event: any): Event => {
  // Transform images array - check both 'all_images' and 'images' fields
  const rawImages = event.all_images || event.images || [];
  
  const images = rawImages.map((img: any) => {
    // Handle different image URL field names: 'image', 'image_url', 'url'
    const imageUrl = img.image || img.image_url || img.url || '';
    
    return {
      id: img.id,
      url: imageUrl,
      caption: img.caption || '',
      is_primary: img.is_primary || false,
      uploaded_at: img.uploaded_at || ''
    };
  });

  return {
    id: event.id,
    title: event.title,
    description: event.description,
    start_date: event.start_date,
    end_date: event.end_date,
    start_time: event.start_time,
    end_time: event.end_time,
    street: event.location?.street || event.street || '',
    city: event.location?.city || event.city || '',
    state: event.location?.state || event.state || '',
    postal_code: event.location?.postal_code || event.postal_code || '',
    max_attendees: event.max_attendees,
    confirmed_attendees: event.confirmed_attendees || 0,
    available_spots: event.available_spots || (event.max_attendees - (event.confirmed_attendees || 0)),
    is_full: event.is_full || false,
    organizer_name: event.organizer?.name || event.organizer_name || '',
    organizer_email: event.organizer?.email || event.organizer_email || '',
    organizer_id: event.organizer?.id || event.organizer_id,
    primary_image: images.find((img: any) => img.is_primary)?.url || images[0]?.url || null,
    all_images: images,
    image_count: images.length,
    full_address: event.full_address || `${event.street || ''} ${event.city || ''}, ${event.state || ''}`.trim(),
    is_active: event.is_active !== false,
    created_at: event.created_at || '',
    is_upcoming: event.is_upcoming || false,
    is_past: event.is_past || false,
    username: event.organizer?.name || event.organizer_name || '',
    email: event.organizer?.email || event.organizer_email || ''
  };
};

class EventsService {
  /**
   * Get all events (public endpoint)
   */
  async getAllEvents(): Promise<Event[]> {
    try {
      // Use apiClientNoAuth since this is a public endpoint
      const response = await apiClient.get('/events/');
      
      // Handle paginated response
      const eventsData = response.data.results || response.data;
      
      // Transform events to match Event interface
      return eventsData.map(transformEvent);
    } catch (error: any) {
      console.error('EventsService: Failed to fetch events:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch events');
    }
  }

  /**
   * Get event by ID (public endpoint)
   */
  async getEventById(id: number): Promise<Event> {
    try {
      // Use apiClientNoAuth since this is a public endpoint
      const response = await apiClient.get(`/events/${id}/`);
      
      // Handle different response structures
      // Single event endpoint returns: { success: true, event: {...} }
      // List endpoint returns: { results: [...] } or direct event object
      const eventData = response.data.event || response.data;
      
      const transformed = transformEvent(eventData);
      return transformed;
    } catch (error: any) {
      console.error('EventsService: Failed to fetch event:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch event');
    }
  }

  /**
   * Create new event (requires authentication)
   */
  async createEvent(eventData: CreateEventData): Promise<Event> {
    try {
      // Use apiClient with interceptors (automatic JWT token)
      const response = await apiClient.post('/events/', eventData);
      return transformEvent(response.data);
    } catch (error: any) {
      console.error('EventsService: Failed to create event:', error);
      throw new Error(error.response?.data?.message || 'Failed to create event');
    }
  }

  /**
   * Update existing event (requires authentication)
   */
  async updateEvent(id: number, eventData: UpdateEventData): Promise<Event> {
    try {
      // Use apiClient with interceptors (automatic JWT token)
      const response = await apiClient.put(`/events/${id}/`, eventData);
      return transformEvent(response.data);
    } catch (error: any) {
      console.error('EventsService: Failed to update event:', error);
      throw new Error(error.response?.data?.message || 'Failed to update event');
    }
  }

  /**
   * Delete event (requires authentication)
   */
  async deleteEvent(id: number): Promise<void> {
    try {
      // Use apiClient with interceptors (automatic JWT token)
      await apiClient.delete(`/events/${id}/`);
    } catch (error: any) {
      console.error('EventsService: Failed to delete event:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete event');
    }
  }

  /**
   * Toggle event active status (requires authentication)
   */
  async toggleEventActive(id: number): Promise<Event> {
    try {
      // Use apiClient with interceptors (automatic JWT token)
      const response = await apiClient.post(`/events/${id}/toggle_active/`);
      return transformEvent(response.data);
    } catch (error: any) {
      console.error('EventsService: Failed to toggle event status:', error);
      throw new Error(error.response?.data?.message || 'Failed to toggle event status');
    }
  }
}

// Export singleton instance
export const eventsService = new EventsService();

