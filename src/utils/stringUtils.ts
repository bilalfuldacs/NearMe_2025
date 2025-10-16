/**
 * String Utility Functions
 * Helper functions for string manipulation and formatting
 */

/**
 * Get initials from name (e.g., "John Doe" -> "JD")
 */
export const getInitials = (name: string): string => {
  if (!name) return '?';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Pluralize word based on count
 */
export const pluralize = (count: number, singular: string, plural?: string): string => {
  if (count === 1) return singular;
  return plural || `${singular}s`;
};

/**
 * Format count with label (e.g., "5 messages", "1 message")
 */
export const formatCount = (count: number, label: string): string => {
  return `${count} ${pluralize(count, label)}`;
};

/**
 * Sanitize email for display (hide part of it)
 */
export const sanitizeEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  if (!domain) return email;
  
  const visibleChars = Math.min(3, username.length);
  const hidden = '*'.repeat(Math.max(0, username.length - visibleChars));
  return `${username.substring(0, visibleChars)}${hidden}@${domain}`;
};

