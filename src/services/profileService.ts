// Profile Service
// Handles all user profile-related API calls

import apiClient from './apiClient';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  username?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export interface ProfileResponse {
  success: boolean;
  user?: UserProfile;
  message?: string;
}

class ProfileService {
  /**
   * Get current user profile
   * GET /api/profile/
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get('/profile/');
      
      return response.data.user || response.data;
    } catch (error: any) {
      console.error('ProfileService: Failed to fetch profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  }

  /**
   * Update user profile
   * PATCH /api/profile/update/
   */
  async updateProfile(data: UpdateProfileData): Promise<ProfileResponse> {
    try {
      const response = await apiClient.patch('/profile/update/', data);
      
      return {
        success: response.data.success || true,
        user: response.data.user,
        message: response.data.message || 'Profile updated successfully'
      };
    } catch (error: any) {
      console.error('ProfileService: Failed to update profile:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  /**
   * Change user password
   * POST /api/profile/change-password/
   */
  async changePassword(data: ChangePasswordData): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post('/profile/change-password/', data);
      
      return {
        success: response.data.success || true,
        message: response.data.message || 'Password changed successfully'
      };
    } catch (error: any) {
      console.error('ProfileService: Failed to change password:', error);
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  }
}

// Export singleton instance
export const profileService = new ProfileService();

