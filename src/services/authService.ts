// Authentication Service
// Handles all authentication-related API calls

import { apiClientNoAuth } from './apiClient';

const API_BASE_URL = 'http://localhost:8000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user: {
    id: number;
    name: string;
    email: string;
    username?: string;
  };
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface RefreshTokenResponse {
  success: boolean;
  access: string;
}

class AuthService {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      
      // Use apiClientNoAuth to avoid interceptor circular dependency
      const response = await apiClientNoAuth.post<AuthResponse>('/login/', credentials);
      
      return response.data;
    } catch (error: any) {
      console.error('AuthService: Login error:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.detail ||
                         error.message || 
                         'Login failed. Please try again.';
      throw new Error(errorMessage);
    }
  }

  /**
   * Register new user
   */
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    try {
      // Remove confirmPassword before sending to backend
      const { confirmPassword, ...signupData } = credentials;
      const response = await apiClientNoAuth.post<AuthResponse>('/create/', signupData);
      
      return response.data;
    } catch (error: any) {
      console.error('AuthService: Signup error:', error.response?.data || error.message);
      
      // Throw user-friendly error message
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.detail ||
                         error.response?.data?.email?.[0] || // Django field errors
                         error.message || 
                         'Signup failed. Please try again.';
      throw new Error(errorMessage);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<string> {
    try {
      // Use apiClientNoAuth to avoid interceptor circular dependency
      const response = await apiClientNoAuth.post<RefreshTokenResponse>('/token/refresh/', {
        refresh: refreshToken
      });
      
      return response.data.access;
    } catch (error: any) {
      console.error('AuthService: Token refresh error:', error.response?.data || error.message);
      throw new Error('Token refresh failed');
    }
  }

  /**
   * Store authentication tokens in localStorage
   */
  storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  /**
   * Store user data in localStorage
   */
  storeUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Get access token from localStorage
   */
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Get user data from localStorage
   */
  getUser(): any {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('AuthService: Failed to parse user data');
        return null;
      }
    }
    return null;
  }

  /**
   * Clear all authentication data
   */
  clearAuth(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();
    const user = this.getUser();
    return !!(accessToken && refreshToken && user);
  }

  /**
   * Validate and refresh token if needed
   */
  async validateSession(): Promise<boolean> {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) {
      return false;
    }

    // For now, assume token is valid if it exists
    // In production, you might want to decode JWT and check expiration
    return true;
  }
}

// Export singleton instance
export const authService = new AuthService();

