import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the Review interface
export interface Review {
  id: number;
  event_id: number;
  user_id: number;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

// Define the Host Reviews interface
export interface HostReviews {
  statistics: {
    average_rating: number;
    total_reviews: number;
    rating_distribution: {
      "5": number;
      "4": number;
      "3": number;
      "2": number;
      "1": number;
    };
  };
  reviews: Array<{
    id: number;
    event_title: string;
    reviewer_name: string;
    rating: number;
    comment: string;
    created_at: string;
  }>;
}

// Define the Event interface based on actual API response
export interface Event {
  id: number;
  title: string;
  description: string;
  max_attendees: number;
  confirmed_attendees?: number;
  available_spots?: number;
  is_full?: boolean;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  street?: string;
  city: string;
  state: string;
  postal_code?: string;
  category?: number;
  category_name?: string;
  category_icon?: string;
  category_description?: string;
  organizer_name: string;
  organizer_email: string;
  organizer_id?: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
  primary_image: string | null;
  all_images: Array<{
    id: number;
    url: string;
    caption: string;
    is_primary: boolean;
    uploaded_at: string;
  }>;
  image_count: number;
  full_address: string;
  is_upcoming: boolean;
  is_past: boolean;
  // Review related fields
  reviews?: Review[];
  average_rating?: number;
  total_reviews?: number;
  host_rating?: number;
  // Host reviews from all their events
  host_average_rating?: number;
  host_total_reviews?: number;
  host_reviews?: HostReviews;
}

// Define the state interface
interface EventsState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: EventsState = {
  events: [],
  loading: false,
  error: null,
};

// Create the slice
const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Set all events
    setEvents: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions
export const {
  setLoading,
  setError,
  setEvents,
} = eventsSlice.actions;

export default eventsSlice.reducer;

