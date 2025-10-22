import { Event } from '../store/eventsSlice';

/**
 * Check if user can review an event
 * User can only review if:
 * 1. Event has already started (start_date + start_time has passed)
 * 2. User is viewing from "My Events" tab (meaning they attended/are attending)
 */
export const canUserReviewEvent = (event: Event, userId?: number): boolean => {
  if (!userId) return false;

  // Check if event has already started
  const now = new Date();
  const eventStartDate = new Date(`${event.start_date}T${event.start_time}`);
  
  // User can only review if event has already started
  return now > eventStartDate;
};

/**
 * Get review eligibility message
 */
export const getReviewEligibilityMessage = (event: Event, userId?: number): string => {
  if (!userId) {
    return 'Please log in to write a review';
  }

  const now = new Date();
  const eventStartDate = new Date(`${event.start_date}T${event.start_time}`);
  
  if (now < eventStartDate) {
    const timeUntilEvent = eventStartDate.getTime() - now.getTime();
    const daysUntilEvent = Math.ceil(timeUntilEvent / (1000 * 60 * 60 * 24));
    
    if (daysUntilEvent === 1) {
      return 'You can review this event after it starts tomorrow';
    } else if (daysUntilEvent > 1) {
      return `You can review this event after it starts in ${daysUntilEvent} days`;
    } else {
      return 'You can review this event after it starts';
    }
  }

  return 'You can review this event';
};

/**
 * Check if event is in the past
 */
export const isEventInPast = (event: Event): boolean => {
  const now = new Date();
  const eventStartDate = new Date(`${event.start_date}T${event.start_time}`);
  return now > eventStartDate;
};

/**
 * Get time until event starts
 */
export const getTimeUntilEvent = (event: Event): string => {
  const now = new Date();
  const eventStartDate = new Date(`${event.start_date}T${event.start_time}`);
  const timeUntilEvent = eventStartDate.getTime() - now.getTime();
  
  if (timeUntilEvent <= 0) {
    return 'Event has started';
  }
  
  const days = Math.floor(timeUntilEvent / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeUntilEvent % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeUntilEvent % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
  } else {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
};
