// API Service for WMS Backend Integration
// This file provides a template for connecting to your WMS API endpoints

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Helper function for API calls
async function fetchAPI(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    // Add authentication headers when needed
    // 'Authorization': `Bearer ${token}`,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Inbound Microservice APIs
export const inboundAPI = {
  // Get all inbound transactions
  getTransactions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/api/inbound/transactions${queryString ? `?${queryString}` : ''}`);
  },

  // Create new inbound transaction
  createTransaction: async (data) => {
    return fetchAPI('/api/inbound/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get transaction by ID
  getTransactionById: async (id) => {
    return fetchAPI(`/api/inbound/transactions/${id}`);
  },

  // Update transaction
  updateTransaction: async (id, data) => {
    return fetchAPI(`/api/inbound/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Outbound Microservice APIs
export const outboundAPI = {
  // Get all outbound transactions
  getTransactions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/api/outbound/transactions${queryString ? `?${queryString}` : ''}`);
  },

  // Create new outbound transaction
  createTransaction: async (data) => {
    return fetchAPI('/api/outbound/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get transaction by ID
  getTransactionById: async (id) => {
    return fetchAPI(`/api/outbound/transactions/${id}`);
  },

  // Update transaction
  updateTransaction: async (id, data) => {
    return fetchAPI(`/api/outbound/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Master Microservice APIs
export const masterAPI = {
  // Get all products
  getProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/api/master/products${queryString ? `?${queryString}` : ''}`);
  },

  // Get product by ID
  getProductById: async (id) => {
    return fetchAPI(`/api/master/products/${id}`);
  },

  // Get all locations/warehouses
  getLocations: async () => {
    return fetchAPI('/api/master/locations');
  },

  // Get location by ID
  getLocationById: async (id) => {
    return fetchAPI(`/api/master/locations/${id}`);
  },

  // Get all SKUs
  getSKUs: async () => {
    return fetchAPI('/api/master/skus');
  },
};

// Product & Task Microservice APIs
export const productTaskAPI = {
  // Get current stock levels
  getCurrentStock: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/api/inventory/stock${queryString ? `?${queryString}` : ''}`);
  },

  // Get stock by product
  getStockByProduct: async (productId) => {
    return fetchAPI(`/api/inventory/stock/product/${productId}`);
  },

  // Get stock by location
  getStockByLocation: async (locationId) => {
    return fetchAPI(`/api/inventory/stock/location/${locationId}`);
  },

  // Get tasks
  getTasks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/api/tasks${queryString ? `?${queryString}` : ''}`);
  },
};

// User Microservice APIs
export const userAPI = {
  // Get current user
  getCurrentUser: async () => {
    return fetchAPI('/api/users/me');
  },

  // Login
  login: async (credentials) => {
    return fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Logout
  logout: async () => {
    return fetchAPI('/api/auth/logout', {
      method: 'POST',
    });
  },
};

// Tenant Microservice APIs
export const tenantAPI = {
  // Get tenant info
  getTenantInfo: async () => {
    return fetchAPI('/api/tenant/info');
  },

  // Get tenant settings
  getTenantSettings: async () => {
    return fetchAPI('/api/tenant/settings');
  },
};

// Combined API for dashboard
export const dashboardAPI = {
  // Get all data for dashboard
  getDashboardData: async () => {
    try {
      const [inbound, outbound, products, stock] = await Promise.all([
        inboundAPI.getTransactions({ limit: 100 }),
        outboundAPI.getTransactions({ limit: 100 }),
        masterAPI.getProducts(),
        productTaskAPI.getCurrentStock(),
      ]);

      return {
        inbound,
        outbound,
        products,
        stock,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Get metrics
  getMetrics: async () => {
    try {
      const stock = await productTaskAPI.getCurrentStock();
      
      return {
        totalStock: stock.reduce((sum, item) => sum + item.quantity, 0),
        uniqueProducts: stock.length,
        lowStockItems: stock.filter(item => item.quantity < 10).length,
      };
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  },
};

// Export utility functions
export const apiUtils = {
  // Set auth token
  setAuthToken: (token) => {
    localStorage.setItem('auth_token', token);
  },

  // Get auth token
  getAuthToken: () => {
    return localStorage.getItem('auth_token');
  },

  // Clear auth token
  clearAuthToken: () => {
    localStorage.removeItem('auth_token');
  },

  // Format date for API
  formatDate: (date) => {
    return new Date(date).toISOString();
  },
};

export default {
  inbound: inboundAPI,
  outbound: outboundAPI,
  master: masterAPI,
  productTask: productTaskAPI,
  user: userAPI,
  tenant: tenantAPI,
  dashboard: dashboardAPI,
  utils: apiUtils,
};
