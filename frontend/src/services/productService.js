/**
 * NÉT. Product Service
 * Handles product listing, filtering, categories, and live search
 */
import { API_CONFIG, apiClient } from './api.js';
import { INITIAL_PRODUCTS } from '../data/products.js';
import { CATEGORIES } from '../data/categories.js';

export const productService = {
  /**
   * Fetch all active products
   */
  async getAll() {
    if (API_CONFIG.USE_BACKEND_API) {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/products`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) return data;
        }
      } catch (err) {
        console.warn('[productService] Backend offline, falling back to local products:', err);
      }
    }
    return Promise.resolve(INITIAL_PRODUCTS);
  },

  /**
   * Get single product by ID
   */
  async getById(id) {
    if (API_CONFIG.USE_BACKEND_API) {
      try {
        const data = await apiClient(`/products/${id}`);
        if (data) return data;
      } catch (err) {
        console.warn('[productService] Backend offline, finding in local products:', err);
      }
    }
    const found = INITIAL_PRODUCTS.find((p) => p.id === String(id));
    return Promise.resolve(found || null);
  },

  /**
   * Filter products by category slug
   */
  async getByCategory(slug) {
    if (API_CONFIG.USE_BACKEND_API) {
      try {
        const data = await apiClient(`/products?category=${encodeURIComponent(slug)}`);
        if (Array.isArray(data)) return data;
      } catch (err) {
        console.warn('[productService] Backend offline, filtering local products:', err);
      }
    }
    if (!slug || slug === 'all') return Promise.resolve(INITIAL_PRODUCTS);
    return Promise.resolve(INITIAL_PRODUCTS.filter((p) => p.category === slug));
  },

  /**
   * Live search query
   */
  async search(query, limit = 5) {
    if (API_CONFIG.USE_BACKEND_API) {
      try {
        const data = await apiClient(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}`);
        if (Array.isArray(data)) return data;
      } catch (err) {
        console.warn('[productService] Backend offline, searching local products:', err);
      }
    }
    const q = (query || '').toLowerCase().trim();
    if (!q) return Promise.resolve([]);
    const matches = INITIAL_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.specsShort && p.specsShort.toLowerCase().includes(q))
    ).slice(0, limit);
    return Promise.resolve(matches);
  },

  /**
   * Get all category metadata
   */
  async getCategories() {
    if (API_CONFIG.USE_BACKEND_API) {
      try {
        const data = await apiClient('/categories');
        if (Array.isArray(data) && data.length > 0) return data;
      } catch (err) {
        console.warn('[productService] Backend offline, returning local categories:', err);
      }
    }
    return Promise.resolve(CATEGORIES);
  }
};
