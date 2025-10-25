import { Event, Review, HostReviews } from '../store/eventsSlice';

// Dummy review data
const dummyReviews: Review[] = [
  {
    id: 1,
    event_id: 1,
    user_id: 101,
    user_name: 'Sarah Johnson',
    rating: 5,
    comment: 'Amazing workshop! The instructor was very knowledgeable and patient with all our questions. I learned so much about sustainable gardening. Highly recommend!',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    event_id: 1,
    user_id: 102,
    user_name: 'Mike Chen',
    rating: 4,
    comment: 'Great event! The location was perfect and the hands-on approach really helped me understand the concepts better. Will definitely attend more workshops.',
    created_at: '2024-01-14T15:45:00Z',
    updated_at: '2024-01-14T15:45:00Z'
  },
  {
    id: 3,
    event_id: 1,
    user_id: 103,
    user_name: 'Emily Rodriguez',
    rating: 5,
    comment: 'Excellent workshop! Sarah was very organized and the materials provided were top quality. I feel confident to start my own garden now.',
    created_at: '2024-01-13T09:20:00Z',
    updated_at: '2024-01-13T09:20:00Z'
  },
  {
    id: 4,
    event_id: 2,
    user_id: 104,
    user_name: 'David Kim',
    rating: 4,
    comment: 'Fantastic wine tasting experience! The sommelier was very knowledgeable and the selection was excellent. Great atmosphere and perfect for a date night.',
    created_at: '2024-01-16T20:15:00Z',
    updated_at: '2024-01-16T20:15:00Z'
  },
  {
    id: 5,
    event_id: 2,
    user_id: 105,
    user_name: 'Lisa Wang',
    rating: 5,
    comment: 'Outstanding wine tasting! The restaurant has a great selection and the staff was very friendly. The food pairings were perfect. Highly recommend!',
    created_at: '2024-01-15T18:30:00Z',
    updated_at: '2024-01-15T18:30:00Z'
  },
  {
    id: 6,
    event_id: 2,
    user_id: 106,
    user_name: 'James Wilson',
    rating: 3,
    comment: 'Good wine selection but the event was a bit crowded. The staff tried their best but service was slow due to the number of attendees.',
    created_at: '2024-01-14T19:45:00Z',
    updated_at: '2024-01-14T19:45:00Z'
  },
  {
    id: 7,
    event_id: 3,
    user_id: 107,
    user_name: 'Anna Thompson',
    rating: 5,
    comment: 'Incredible photography walk! Mike was an excellent guide and taught us so many techniques. The Brooklyn Bridge provided amazing photo opportunities.',
    created_at: '2024-01-17T14:20:00Z',
    updated_at: '2024-01-17T14:20:00Z'
  },
  {
    id: 8,
    event_id: 3,
    user_id: 108,
    user_name: 'Robert Davis',
    rating: 4,
    comment: 'Great photography workshop! Learned a lot about composition and lighting. The group was friendly and Mike was very helpful with individual tips.',
    created_at: '2024-01-16T11:30:00Z',
    updated_at: '2024-01-16T11:30:00Z'
  },
  {
    id: 9,
    event_id: 4,
    user_id: 109,
    user_name: 'Maria Garcia',
    rating: 5,
    comment: 'Fantastic cooking class! The chef was amazing and taught us authentic Italian techniques. The food we made was delicious and the restaurant atmosphere was perfect.',
    created_at: '2024-01-18T21:00:00Z',
    updated_at: '2024-01-18T21:00:00Z'
  },
  {
    id: 10,
    event_id: 4,
    user_id: 110,
    user_name: 'John Smith',
    rating: 4,
    comment: 'Great cooking experience! The chef was very patient and the recipes were easy to follow. The restaurant has a nice setup for cooking classes.',
    created_at: '2024-01-17T19:15:00Z',
    updated_at: '2024-01-17T19:15:00Z'
  }
];

// Host ratings for different events
const hostRatings: { [eventId: number]: number } = {
  1: 4.8, // Sarah Johnson - Community Garden Workshop
  2: 4.2, // The Vineyard Restaurant - Wine Tasting
  3: 4.9, // Mike Chen - Photography Walk
  4: 4.6  // Bella Vista Restaurant - Cooking Class
};

// Host reviews data - reviews from all their past events
const hostReviewsData: { [organizerEmail: string]: HostReviews } = {
  'sarah.johnson@example.com': {
    statistics: {
      average_rating: 4.7,
      total_reviews: 25,
      rating_distribution: {
        "5": 15,
        "4": 7,
        "3": 2,
        "2": 1,
        "1": 0
      }
    },
    reviews: [
      {
        id: 101,
        event_title: 'Community Garden Workshop',
        reviewer_name: 'Alice Green',
        rating: 5,
        comment: 'Sarah is an amazing instructor! Her passion for gardening is contagious and she explains everything so clearly.',
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: 102,
        event_title: 'Urban Farming Basics',
        reviewer_name: 'Bob Wilson',
        rating: 5,
        comment: 'Excellent workshop! Sarah knows her stuff and makes learning fun. Highly recommend her events.',
        created_at: '2024-01-10T14:20:00Z'
      },
      {
        id: 103,
        event_title: 'Composting 101',
        reviewer_name: 'Carol Davis',
        rating: 4,
        comment: 'Great session on composting. Sarah is very knowledgeable and patient with questions.',
        created_at: '2024-01-05T16:45:00Z'
      },
      {
        id: 104,
        event_title: 'Herb Garden Workshop',
        reviewer_name: 'David Lee',
        rating: 5,
        comment: 'Fantastic workshop! Sarah provided great tips and the hands-on approach was perfect.',
        created_at: '2023-12-28T11:15:00Z'
      },
      {
        id: 105,
        event_title: 'Winter Gardening Tips',
        reviewer_name: 'Eva Martinez',
        rating: 4,
        comment: 'Very informative session. Sarah shared practical advice that I can actually use in my garden.',
        created_at: '2023-12-20T13:30:00Z'
      }
    ]
  },
  'vineyard@restaurant.com': {
    statistics: {
      average_rating: 4.2,
      total_reviews: 18,
      rating_distribution: {
        "5": 8,
        "4": 6,
        "3": 3,
        "2": 1,
        "1": 0
      }
    },
    reviews: [
      {
        id: 201,
        event_title: 'Wine Tasting Evening',
        reviewer_name: 'Frank Johnson',
        rating: 4,
        comment: 'Great wine selection and knowledgeable sommelier. The atmosphere was perfect for a date night.',
        created_at: '2024-01-16T20:15:00Z'
      },
      {
        id: 202,
        event_title: 'Champagne Brunch',
        reviewer_name: 'Grace Smith',
        rating: 5,
        comment: 'Amazing brunch experience! The food was delicious and the champagne pairings were spot on.',
        created_at: '2024-01-12T12:00:00Z'
      },
      {
        id: 203,
        event_title: 'Red Wine Masterclass',
        reviewer_name: 'Henry Brown',
        rating: 4,
        comment: 'Very educational wine tasting. Learned a lot about different red wine regions and flavors.',
        created_at: '2024-01-08T19:30:00Z'
      },
      {
        id: 204,
        event_title: 'Sparkling Wine Night',
        reviewer_name: 'Iris White',
        rating: 3,
        comment: 'Good selection of sparkling wines, but the event felt a bit rushed. Staff was friendly though.',
        created_at: '2023-12-30T18:45:00Z'
      }
    ]
  },
  'mike.chen@photography.com': {
    statistics: {
      average_rating: 4.9,
      total_reviews: 32,
      rating_distribution: {
        "5": 28,
        "4": 3,
        "3": 1,
        "2": 0,
        "1": 0
      }
    },
    reviews: [
      {
        id: 301,
        event_title: 'Photography Walk',
        reviewer_name: 'Jack Wilson',
        rating: 5,
        comment: 'Mike is an incredible photography instructor! His tips on composition and lighting were game-changing.',
        created_at: '2024-01-17T14:20:00Z'
      },
      {
        id: 302,
        event_title: 'Street Photography Workshop',
        reviewer_name: 'Kate Anderson',
        rating: 5,
        comment: 'Best photography workshop I\'ve ever attended! Mike\'s teaching style is engaging and practical.',
        created_at: '2024-01-14T10:00:00Z'
      },
      {
        id: 303,
        event_title: 'Sunset Photography Session',
        reviewer_name: 'Leo Garcia',
        rating: 5,
        comment: 'Amazing sunset photography session! Mike helped me capture some incredible shots.',
        created_at: '2024-01-11T17:30:00Z'
      },
      {
        id: 304,
        event_title: 'Portrait Photography Basics',
        reviewer_name: 'Maya Patel',
        rating: 5,
        comment: 'Excellent portrait photography workshop. Mike\'s techniques really improved my photos.',
        created_at: '2024-01-07T15:45:00Z'
      },
      {
        id: 305,
        event_title: 'Macro Photography Adventure',
        reviewer_name: 'Noah Kim',
        rating: 4,
        comment: 'Great macro photography session. Mike is very patient and explains technical concepts well.',
        created_at: '2024-01-03T11:00:00Z'
      }
    ]
  },
  'bella.vista@restaurant.com': {
    statistics: {
      average_rating: 4.6,
      total_reviews: 22,
      rating_distribution: {
        "5": 12,
        "4": 8,
        "3": 2,
        "2": 0,
        "1": 0
      }
    },
    reviews: [
      {
        id: 401,
        event_title: 'Cooking Class: Italian Cuisine',
        reviewer_name: 'Olivia Taylor',
        rating: 5,
        comment: 'Fantastic cooking class! The chef was amazing and taught us authentic Italian techniques.',
        created_at: '2024-01-18T21:00:00Z'
      },
      {
        id: 402,
        event_title: 'Pasta Making Workshop',
        reviewer_name: 'Paul Rodriguez',
        rating: 4,
        comment: 'Great hands-on pasta making experience. The chef was very knowledgeable and patient.',
        created_at: '2024-01-15T18:30:00Z'
      },
      {
        id: 403,
        event_title: 'Pizza Masterclass',
        reviewer_name: 'Quinn Lee',
        rating: 5,
        comment: 'Amazing pizza making class! Learned so much about authentic Italian pizza techniques.',
        created_at: '2024-01-12T19:15:00Z'
      },
      {
        id: 404,
        event_title: 'Gelato Making Session',
        reviewer_name: 'Rachel Chen',
        rating: 4,
        comment: 'Fun gelato making workshop! The chef shared great tips and the results were delicious.',
        created_at: '2024-01-09T16:00:00Z'
      }
    ]
  }
};

// Note: These utility functions are no longer needed since the backend
// already provides host_average_rating and host_total_reviews in the API response

/**
 * Get reviews for a specific event
 */
export const getEventReviews = (eventId: number): Review[] => {
  return dummyReviews.filter(review => review.event_id === eventId);
};

/**
 * Get host rating for a specific event
 */
export const getHostRating = (eventId: number): number => {
  return hostRatings[eventId] || 0;
};

/**
 * Review utility functions
 */

export interface ReviewData {
  rating: number;
  comment: string;
}

/**
 * Validates review data before submission
 */
export const validateReview = (rating: number, comment: string): { isValid: boolean; error?: string } => {
  if (!rating || rating < 1 || rating > 5) {
    return {
      isValid: false,
      error: `Please provide a valid rating between 1 and 5 stars. Current: ${rating}`
    };
  }

  if (!comment || !comment.trim()) {
    return {
      isValid: false,
      error: 'Please provide a comment.'
    };
  }

  return { isValid: true };
};

/**
 * Formats rating text based on numeric value
 */
export const getRatingText = (rating: number): string => {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4.0) return 'Very Good';
  if (rating >= 3.5) return 'Good';
  if (rating >= 3.0) return 'Average';
  if (rating >= 2.0) return 'Below Average';
  return 'Poor';
};

/**
 * Gets color for rating chip
 */
export const getRatingColor = (rating: number): 'success' | 'warning' | 'error' => {
  if (rating >= 4.0) return 'success';
  if (rating >= 3.0) return 'warning';
  return 'error';
};

/**
 * Checks if a review belongs to the current user
 */
export const isOwnReview = (review: any, currentUserId: number | undefined): boolean => {
  if (!currentUserId || !review.reviewer) return false;
  return currentUserId === review.reviewer || currentUserId.toString() === review.reviewer.toString();
};
