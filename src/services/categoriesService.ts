// Categories Service
// Handles all category-related API calls

import { apiClientNoAuth } from './apiClient';

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  created_at?: string;
}

export interface CategoriesResponse {
  success: boolean;
  count: number;
  categories: Category[];
}

class CategoriesService {
  /**
   * Get all categories (public endpoint)
   */
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await apiClientNoAuth.get('/categories/');
      
      // Handle different response structures
      const categoriesData = response.data.categories || response.data.results || response.data;
      
      return Array.isArray(categoriesData) ? categoriesData : [];
    } catch (error: any) {
      console.error('CategoriesService: Failed to fetch categories:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  }

  /**
   * Get category by ID (public endpoint)
   */
  async getCategoryById(id: number): Promise<Category> {
    try {
      const response = await apiClientNoAuth.get(`/categories/${id}/`);
      return response.data.category || response.data;
    } catch (error: any) {
      console.error('CategoriesService: Failed to fetch category:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch category');
    }
  }
}

// Export singleton instance
export const categoriesService = new CategoriesService();

