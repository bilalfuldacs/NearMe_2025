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
  category?: number;
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
    category: event.category,
    category_name: event.category_details?.name || event.category_name,
    category_icon: event.category_details?.icon,
    category_description: event.category_details?.description,
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

export interface EventFilters {
  category?: string;     // Filter by category ID
  search?: string;       // Search across title, description, city, state, category name
  start_date?: string;   // Filter: event.start_date >= this date (YYYY-MM-DD)
  end_date?: string;     // Filter: event.start_date <= this date (YYYY-MM-DD)
}

class EventsService {
  /**
   * Get all events with optional filters (public endpoint)
   * 
   * Search functionality:
   * - Backend searches across: title, description, city, state, category__name
   * - Case-insensitive search
   * - Returns events matching ANY of these fields
   * 
   * Date filtering:
   * - start_date: Returns events where event.start_date >= start_date
   * - end_date: Returns events where event.start_date <= end_date
   * - Both: Returns events where start_date <= event.start_date <= end_date
   * 
   * Examples:
   * - getAllEvents({ search: 'sports' }) → Events with "sports" in any field
   * - getAllEvents({ category: '17' }) → Events in category 17
   * - getAllEvents({ start_date: '2025-11-15' }) → Events starting on/after Nov 15
   * - getAllEvents({ end_date: '2025-11-30' }) → Events starting on/before Nov 30
   * - getAllEvents({ start_date: '2025-11-01', end_date: '2025-11-30' }) → Events in November
   * - getAllEvents({ search: 'beach', category: '17', start_date: '2025-11-15' }) → Combined filters
   */
  async getAllEvents(filters?: EventFilters): Promise<Event[]> {
    try {
      // Build query parameters
      const params: any = {};
      
      if (filters?.category) {
        params.category = filters.category;
      }
      
      // Backend searches in: title, description, city, state, category__name
      if (filters?.search) {
        params.search = filters.search;
      }
      
      // Date range filters
      if (filters?.start_date) {
        params.start_date = filters.start_date;
      }
      
      if (filters?.end_date) {
        params.end_date = filters.end_date;
      }

      // Use apiClient with query parameters
      const response = await apiClient.get('/events/', { params });
      
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

