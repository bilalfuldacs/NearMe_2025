/**
 * Event Utility Functions
 * Helper functions for event-related calculations and formatting
 */

/**
 * Calculate available spots for an event
 */
export const calculateAvailableSpots = (maxAttendees: number, confirmedAttendees: number = 0): number => {
  return Math.max(0, maxAttendees - confirmedAttendees);
};

/**
 * Check if event is full
 */
export const isEventFull = (maxAttendees: number, confirmedAttendees: number = 0): boolean => {
  return confirmedAttendees >= maxAttendees;
};

/**
 * Get event capacity percentage
 */
export const getCapacityPercentage = (maxAttendees: number, confirmedAttendees: number = 0): number => {
  if (maxAttendees === 0) return 0;
  return Math.round((confirmedAttendees / maxAttendees) * 100);
};

/**
 * Format event address
 */
export const formatEventAddress = (
  street?: string,
  city?: string,
  state?: string,
  postalCode?: string
): string => {
  const parts = [street, city, state, postalCode].filter(Boolean);
  return parts.join(', ');
};

/**
 * Get event status text
 */
export const getEventStatusText = (isUpcoming: boolean, isPast: boolean, isActive: boolean): string => {
  if (isPast) return 'Past Event';
  if (!isActive) return 'Inactive';
  if (isUpcoming) return 'Upcoming';
  return 'Active';
};

/**
 * Check if user can join event
 */
export const canJoinEvent = (
  isFull: boolean,
  isPast: boolean,
  isActive: boolean,
  isOrganizer: boolean
): boolean => {
  if (isOrganizer) return false; // Organizers can't join their own event
  if (isPast) return false;
  if (!isActive) return false;
  if (isFull) return false;
  return true;
};

