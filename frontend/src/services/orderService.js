/**
 * NÉT. Order Service
 * Handles order creation, status history, order tracking, and cancellation
 */
import { API_CONFIG, apiClient } from './api.js';
import { getStorage, setStorage } from '../utils/storage.js';

const ORDERS_STORAGE_KEY = 'net_orders';

export const orderService = {
  /**
   * Get all customer orders
   */
  async getOrders() {
    if (API_CONFIG.USE_BACKEND_API) {
      return await apiClient('/orders');
    }
    return Promise.resolve(getStorage(ORDERS_STORAGE_KEY, []));
  },

  /**
   * Get single order by orderId
   */
  async getOrderById(orderId) {
    if (API_CONFIG.USE_BACKEND_API) {
      return await apiClient(`/orders/${orderId}`);
    }
    const orders = getStorage(ORDERS_STORAGE_KEY, []);
    const found = orders.find((o) => o.orderId === orderId);
    return Promise.resolve(found || null);
  },

  /**
   * Create a new order
   */
  async createOrder(orderPayload) {
    if (API_CONFIG.USE_BACKEND_API) {
      return await apiClient('/orders', {
        method: 'POST',
        body: orderPayload,
      });
    }

    const currentOrders = getStorage(ORDERS_STORAGE_KEY, []);
    const newOrder = {
      ...orderPayload,
      createdAt: new Date().toISOString(),
      status: orderPayload.paymentMethod === 'vietqr' ? 'Chờ thanh toán QR' : 'Đang xử lý',
    };
    const updated = [newOrder, ...currentOrders];
    setStorage(ORDERS_STORAGE_KEY, updated);
    return Promise.resolve(newOrder);
  },

  /**
   * Cancel an order with a reason
   */
  async cancelOrder(orderId, reason) {
    if (API_CONFIG.USE_BACKEND_API) {
      return await apiClient(`/orders/${orderId}/cancel`, {
        method: 'POST',
        body: { reason },
      });
    }

    const currentOrders = getStorage(ORDERS_STORAGE_KEY, []);
    const updated = currentOrders.map((o) =>
      o.orderId === orderId
        ? { ...o, status: 'Đã hủy', cancelReason: reason, cancelledAt: new Date().toISOString() }
        : o
    );
    setStorage(ORDERS_STORAGE_KEY, updated);
    return Promise.resolve({ success: true, orderId, reason });
  }
};

