/**
 * Validation Utility Functions
 * Reusable validation helpers
 */

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isStrongPassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Check if string is empty or whitespace
 */
export const isEmpty = (value: string | null | undefined): boolean => {
  return !value || value.trim().length === 0;
};

/**
 * Validate required field
 */
export const validateRequired = (value: string, fieldName: string): string => {
  return isEmpty(value) ? `${fieldName} is required` : '';
};

/**
 * Validate min length
 */
export const validateMinLength = (value: string, minLength: number, fieldName: string): string => {
  if (isEmpty(value)) return '';
  return value.length < minLength ? `${fieldName} must be at least ${minLength} characters` : '';
};

/**
 * Validate max length
 */
export const validateMaxLength = (value: string, maxLength: number, fieldName: string): string => {
  return value.length > maxLength ? `${fieldName} must be less than ${maxLength} characters` : '';
};

/**
 * Validate number range
 */
export const validateNumberRange = (value: number, min: number, max: number, fieldName: string): string => {
  if (value < min) return `${fieldName} must be at least ${min}`;
  if (value > max) return `${fieldName} must be at most ${max}`;
  return '';
};

