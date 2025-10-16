// Services Index
// Centralized exports for all services

export { authService } from './authService';
export type { LoginCredentials, SignupCredentials, AuthResponse } from './authService';

export { eventsService } from './eventsService';
export type { CreateEventData, UpdateEventData, EventFilters } from './eventsService';

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

export { categoriesService } from './categoriesService';
export type { Category } from './categoriesService';

export { default as apiClient, apiClientNoAuth } from './apiClient';

