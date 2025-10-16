import { useState, useCallback } from 'react';
import { conversationsService } from '../services/conversationsService';

interface UseConversationStatusOptions {
  onSuccess?: (status: 'confirmed' | 'rejected') => void;
  onError?: (error: string) => void;
}

export const useConversationStatus = (options: UseConversationStatusOptions = {}) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (conversationId: number, status: 'confirmed' | 'rejected', eventId?: number) => {
      setUpdating(true);
      setError(null);

      try {
        await conversationsService.updateConversationStatus(conversationId, status, eventId);
        
        if (options.onSuccess) {
          options.onSuccess(status);
        }
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to update status';
        setError(errorMessage);
        
        if (options.onError) {
          options.onError(errorMessage);
        }
        
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [options]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    updating,
    error,
    updateStatus,
    clearError,
  };
};

