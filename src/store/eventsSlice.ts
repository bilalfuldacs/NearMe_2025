import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the Event interface based on actual API response
export interface Event {
  id: number;
  title: string;
  description: string;
  max_attendees: number;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  city: string;
  state: string;
  organizer_name: string;
  organizer_email: string;
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

// Export reducer
export default eventsSlice.reducer;
