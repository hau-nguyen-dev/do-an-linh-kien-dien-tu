/**
 * NÉT. Customer Review Service
 * Handles user ratings, reviews list, and new submissions
 */
import { API_CONFIG, apiClient } from './api.js';
import { getStorage, setStorage } from '../utils/storage.js';

const REVIEWS_STORAGE_KEY = 'net_custom_reviews';

export const reviewService = {
  /**
   * Get custom reviews for a given product ID
   */
  async getByProductId(productId) {
    if (API_CONFIG.USE_BACKEND_API) {
      return await apiClient(`/products/${productId}/reviews`);
    }
    const store = getStorage(REVIEWS_STORAGE_KEY, {});
    return Promise.resolve(store[productId] || []);
  },

  /**
   * Submit a new customer review
   */
  async addReview(productId, reviewData) {
    if (API_CONFIG.USE_BACKEND_API) {
      return await apiClient(`/products/${productId}/reviews`, {
        method: 'POST',
        body: reviewData,
      });
    }

    const store = getStorage(REVIEWS_STORAGE_KEY, {});
    const existing = store[productId] || [];
    const newReview = {
      ...reviewData,
      id: Date.now(),
      date: new Date().toLocaleDateString('vi-VN'),
    };
    store[productId] = [newReview, ...existing];
    setStorage(REVIEWS_STORAGE_KEY, store);
    return Promise.resolve(newReview);
  }
};

