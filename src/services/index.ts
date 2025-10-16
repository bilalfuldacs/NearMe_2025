// Services Index
// Centralized exports for all services

export { authService } from './authService';
export type { LoginCredentials, SignupCredentials, AuthResponse } from './authService';

export { eventsService } from './eventsService';
export type { CreateEventData, UpdateEventData } from './eventsService';

export { conversationsService } from './conversationsService';
export type { 
  Message,
  ConversationDetail,
  ConversationListItem,
  CreateConversationData,
  ConversationResponse,
  CheckConversationResponse,
  ConversationsListResponse,
  ConversationMessagesResponse
} from './conversationsService';

export { default as apiClient, apiClientNoAuth } from './apiClient';

