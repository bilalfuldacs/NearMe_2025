import { useState, useCallback } from 'react';

/**
 * Custom hook for handling form data with nested objects
 * Supports dot notation for nested properties (e.g., "address.street")
 */
export const useFormData = <T extends Record<string, any>>(initialData: T) => {
  const [formData, setFormData] = useState<T>(initialData);

  // Generic function to update nested object properties
  const updateNestedValue = useCallback((obj: any, path: string, value: any): any => {
    const keys = path.split('.');
    const result = { ...obj };
    let current = result;

    // Navigate to the parent object
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current) || typeof current[keys[i]] !== 'object') {
        current[keys[i]] = {};
      }
      current = { ...current[keys[i]] };
    }

    // Set the final value
    current[keys[keys.length - 1]] = value;

    // Rebuild the nested structure immutably
    let nested = current;
    for (let i = keys.length - 2; i >= 0; i--) {
      nested = { ...result[keys[i]], [keys[i + 1]]: nested };
      result[keys[i]] = nested;
    }

    return result;
  }, []);

  // Handle input changes for both simple and nested properties
  const handleInputChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    
    setFormData(prevData => {
      if (name.includes('.')) {
        return updateNestedValue(prevData, name, value);
      } else {
        return { ...prevData, [name]: value };
      }
    });
  }, [updateNestedValue]);

  // Direct setter for programmatic updates
  const setValue = useCallback((path: string, value: any) => {
    setFormData(prevData => {
      if (path.includes('.')) {
        return updateNestedValue(prevData, path, value);
      } else {
        return { ...prevData, [path]: value };
      }
    });
  }, [updateNestedValue]);

  // Reset form to initial data
  const resetForm = useCallback(() => {
    setFormData(initialData);
  }, [initialData]);

  return {
    formData,
    handleInputChange,
    setValue,
    resetForm,
    setFormData
  };
};
