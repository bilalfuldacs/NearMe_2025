// Conversations Service
// Handles all conversation and join request related API calls

import apiClient from './apiClient';
import { getStatusNotificationMessage } from '../utils';

export interface CreateConversationData {
  event_id: number;
  message: string;
}

export interface ConversationResponse {
  success: boolean;
  conversation_id: number;
  message?: string;
}

export interface Message {
  id: number;
  conversation: number;
  sender: {
    id: number;
    name: string;
    email: string;
  };
  text: string;
  created_at: string;
}

export interface ConversationDetail {
  id: number;
  status: 'pending' | 'confirmed' | 'rejected';
  created_at: string;
  updated_at: string;
  confirmed_at: string | null;
  rejected_at: string | null;
  event: {
    id: number;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    city: string;
    state: string;
    max_attendees: number;
    confirmed_attendees: number;
    is_full: boolean;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  host: {
    id: number;
    name: string;
    email: string;
  };
  message_count: number;
}

export interface CheckConversationResponse {
  success: boolean;
  exists: boolean;
  conversation?: ConversationDetail;
  messages?: Message[];
}

export interface ConversationListItem {
  conversation_id: number;
  status: 'pending' | 'confirmed' | 'rejected';
  created_at: string;
  updated_at: string;
  my_role: string;
  event: {
    id: number;
    title: string;
    start_date: string;
    end_date: string;
    city: string;
    state: string;
  };
  other_person: {
    id: number;
    name: string;
    email: string;
  };
  last_message: {
    id: number;
    text: string;
    sender_name: string;
    sender_id: number;
    created_at: string;
    is_read: boolean;
  };
  message_count: number;
  unread_count: number;
}

export interface ConversationsListResponse {
  success: boolean;
  count: number;
  conversations: ConversationListItem[];
}

export interface ConversationMessagesResponse {
  success: boolean;
  conversation: {
    id: number;
    status: string;
    event: {
      id: number;
      title: string;
      description: string;
      start_date: string;
      city: string;
      state: string;
    };
    user: {
      id: number;
      name: string;
      email: string;
    };
    host: {
      id: number;
      name: string;
      email: string;
    };
    message_count: number;
  };
  messages: Message[];
}

export interface EventAttendeesResponse {
  success: boolean;
  count: number;
  event: {
    id: number;
    title: string;
    confirmed_attendees: number;
    available_spots: number;
  };
  conversations: Array<{
    conversation_id: number;
    user_id: number;
    user_name: string;
    user_email: string;
    status: 'pending' | 'confirmed' | 'rejected';
    created_at: string;
    confirmed_at?: string;
    rejected_at?: string;
    message_count: number;
  }>;
}

class ConversationsService {
  /**
   * Send join request / Create conversation (requires authentication)
   */
  async sendJoinRequest(data: CreateConversationData): Promise<ConversationResponse> {
    try {
      // Use apiClient with interceptors (automatic JWT token)
      const response = await apiClient.post('/conversations/', {
        event_id: data.event_id,
        message: data.message || "Hi! I'd like to join this event."
      });
      
      return {
        success: true,
        conversation_id: response.data.conversation_id || response.data.id,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('ConversationsService: Failed to send join request:', error);
      throw new Error(error.response?.data?.message || 'Failed to send join request');
    }
  }

  /**
   * Check if conversation exists for an event and get all messages
   * GET /api/conversations/event/{eventId}/my-conversation/
   */
  async checkConversation(eventId: number): Promise<CheckConversationResponse> {
    try {
      const response = await apiClient.get(`/conversations/event/${eventId}/my-conversation/`);
      
      // If conversation exists, response will have the data
      return {
        success: response.data.success || true,
        exists: response.data.exists || true,
        conversation: response.data.conversation,
        messages: response.data.messages || []
      };
    } catch (error: any) {
      // If 404 or conversation doesn't exist, return exists: false
      if (error.response?.status === 404) {
        return {
          success: true,
          exists: false,
          conversation: undefined,
          messages: []
        };
      }
      
      console.error('ConversationsService: Failed to check conversation:', error);
      throw new Error(error.response?.data?.message || 'Failed to check conversation');
    }
  }

  /**
   * Send a message (works for both new conversations and existing ones)
   * Backend handles whether to create new conversation or add to existing
   */
  async sendMessage(eventId: number, message: string): Promise<any> {
    try {
      // Use same endpoint as sendJoinRequest
      // Backend will detect if conversation exists and add message accordingly
      const response = await apiClient.post('/conversations/', {
        event_id: eventId,
        message: message
      });
      
      return response.data;
    } catch (error: any) {
      console.error('ConversationsService: Failed to send message:', error);
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  }

  /**
   * Get all conversations for the current user
   * GET /api/conversations/my-conversations/
   */
  async getMyConversations(): Promise<ConversationsListResponse> {
    try {
      const response = await apiClient.get('/conversations/my-conversations/');
      
      return {
        success: response.data.success || true,
        count: response.data.count || response.data.conversations?.length || 0,
        conversations: response.data.conversations || []
      };
    } catch (error: any) {
      console.error('ConversationsService: Failed to fetch conversations:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch conversations');
    }
  }

  /**
   * Get specific conversation with all messages
   * GET /api/conversations/{conversation_id}/
   */
  async getConversationMessages(conversationId: number): Promise<ConversationMessagesResponse> {
    try {
      const response = await apiClient.get(`/conversations/${conversationId}/`);
      
      return {
        success: response.data.success || true,
        conversation: response.data.conversation,
        messages: response.data.messages || []
      };
    } catch (error: any) {
      console.error('ConversationsService: Failed to fetch conversation messages:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch messages');
    }
  }

  /**
   * Get all attendees/conversations for an event (Host only)
   * GET /api/conversations/event/{event_id}/
   */
  async getEventAttendees(eventId: number): Promise<EventAttendeesResponse> {
    try {
      const response = await apiClient.get(`/conversations/event/${eventId}/`);
      
      return {
        success: response.data.success || true,
        count: response.data.count || 0,
        event: response.data.event,
        conversations: response.data.conversations || []
      };
    } catch (error: any) {
      console.error('ConversationsService: Failed to fetch event attendees:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch event attendees');
    }
  }

  /**
   * Update conversation status and send notification message
   * PATCH /api/conversations/{conversation_id}/status/
   */
  async updateConversationStatus(
    conversationId: number, 
    status: 'confirmed' | 'rejected',
    eventId?: number
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Update status
      const response = await apiClient.patch(`/conversations/${conversationId}/status/`, {
        status: status
      });
      
      // Send automatic notification message to user
      if (eventId) {
        const notificationMessage = getStatusNotificationMessage(status);
        
        try {
          await this.sendMessage(eventId, notificationMessage);
        } catch (msgError) {
          console.error('Failed to send notification message:', msgError);
          // Don't throw error if notification fails, status update succeeded
        }
      }
      
      return {
        success: response.data.success || true,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('ConversationsService: Failed to update conversation status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update conversation status');
    }
  }

  /**
   * Mark all messages in a conversation as read
   * POST /api/messages/mark-read/
   */
  async markMessagesAsRead(conversationId: number): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post('/messages/mark-read/', {
        conversation_id: conversationId
      });
      
      return {
        success: response.data.success || true,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('ConversationsService: Failed to mark messages as read:', error);
      throw new Error(error.response?.data?.message || 'Failed to mark messages as read');
    }
  }
}

// Export singleton instance
export const conversationsService = new ConversationsService();
