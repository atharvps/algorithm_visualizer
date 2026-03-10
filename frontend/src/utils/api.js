import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Token is set on the instance headers from the store
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401s
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        // Dynamically import to avoid circular deps
        const { default: useAuthStore } = await import('@/store/authStore');
        const refreshed = await useAuthStore.getState().refreshAccessToken();
        if (refreshed) {
          const newToken = useAuthStore.getState().accessToken;
          original.headers['Authorization'] = `Bearer ${newToken}`;
          return api(original);
        }
      } catch {
        // Refresh failed - user will be logged out
      }
    }

    return Promise.reject(error);
  }
);

export default api;
