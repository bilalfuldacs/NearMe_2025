/**
 * Status Utility Functions
 * Centralized status-related logic for conversations and requests
 */

export type ConversationStatus = 'pending' | 'confirmed' | 'rejected';
export type StatusColor = 'warning' | 'success' | 'error' | 'default';

/**
 * Get MUI color for conversation status
 */
export const getStatusColor = (status: string): StatusColor => {
  switch (status.toLowerCase()) {
    case 'confirmed':
      return 'success';
    case 'rejected':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
};

/**
 * Get background color for status display
 */
export const getStatusBackgroundColor = (status: ConversationStatus): string => {
  switch (status) {
    case 'confirmed':
      return '#d4edda'; // Light green
    case 'rejected':
      return '#f8d7da'; // Light red
    case 'pending':
      return '#fff3cd'; // Light yellow
    default:
      return '#f8f9fa'; // Light gray
  }
};

/**
 * Get user-friendly status message
 */
export const getStatusMessage = (status: ConversationStatus, userName: string): string => {
  switch (status) {
    case 'confirmed':
      return `${userName} is confirmed to join this event`;
    case 'rejected':
      return `${userName}'s request was rejected`;
    case 'pending':
      return `${userName} wants to join your event`;
    default:
      return '';
  }
};

/**
 * Get confirmation message for status update
 */
export const getStatusConfirmationMessage = (
  currentStatus: ConversationStatus,
  newStatus: 'confirmed' | 'rejected',
  userName: string
): string => {
  if (newStatus === 'confirmed') {
    return currentStatus === 'rejected' 
      ? `Change status to confirmed for ${userName}?`
      : `Confirm ${userName}'s request to join?`;
  } else {
    return currentStatus === 'confirmed'
      ? `Are you sure you want to revoke ${userName}'s confirmation?`
      : `Are you sure you want to reject ${userName}'s request?`;
  }
};

/**
 * Get automatic notification message for status change
 */
export const getStatusNotificationMessage = (status: 'confirmed' | 'rejected'): string => {
  return status === 'confirmed'
    ? '✅ Great news! Your request to join this event has been confirmed. See you there!'
    : '❌ Sorry, your request to join this event has been declined. Thank you for your interest.';
};

