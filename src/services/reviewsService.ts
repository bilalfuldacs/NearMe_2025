import apiClient from './apiClient';

export interface CreateReviewData {
  event_id: number;
  rating: number;
  comment: string;
}

export interface Review {
  id: number;
  event_id: number;
  user_id: number;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

class ReviewsService {
  /**
   * Create a new review for an event
   */
  async createReview(reviewData: CreateReviewData): Promise<Review> {
    try {
      const response = await apiClient.post('/reviews/', reviewData);
      return response.data;
    } catch (error: any) {
      console.error('ReviewsService: Failed to create review:', error);
      throw new Error(error.response?.data?.message || 'Failed to create review');
    }
  }

  /**
   * Get reviews for a specific event
   */
  async getEventReviews(eventId: number): Promise<Review[]> {
    try {
      const response = await apiClient.get(`/reviews/?event_id=${eventId}`);
      return response.data.results || response.data;
    } catch (error: any) {
      console.error('ReviewsService: Failed to fetch event reviews:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }

  /**
   * Get user's reviews
   */
  async getUserReviews(): Promise<Review[]> {
    try {
      const response = await apiClient.get('/reviews/my-reviews/');
      return response.data.results || response.data;
    } catch (error: any) {
      console.error('ReviewsService: Failed to fetch user reviews:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user reviews');
    }
  }

  /**
   * Update a review
   */
  async updateReview(reviewId: number, reviewData: Partial<CreateReviewData>): Promise<Review> {
    try {
      const response = await apiClient.put(`/reviews/${reviewId}/`, reviewData);
      return response.data;
    } catch (error: any) {
      console.error('ReviewsService: Failed to update review:', error);
      throw new Error(error.response?.data?.message || 'Failed to update review');
    }
  }

  /**
   * Delete a review
   */
  async deleteReview(reviewId: number): Promise<void> {
    try {
      await apiClient.delete(`/reviews/${reviewId}/`);
    } catch (error: any) {
      console.error('ReviewsService: Failed to delete review:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete review');
    }
  }
}

export const reviewsService = new ReviewsService();
