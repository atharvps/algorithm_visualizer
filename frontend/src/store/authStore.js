import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '@/utils/api';
import toast from 'react-hot-toast';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Register
      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/auth/register', data);
          const { user, accessToken, refreshToken } = res.data.data;
          set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          toast.success('Account created successfully!');
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || 'Registration failed';
          set({ error: msg, isLoading: false });
          toast.error(msg);
          return { success: false, error: msg };
        }
      },

      // Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.post('/auth/login', credentials);
          const { user, accessToken, refreshToken } = res.data.data;
          set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          toast.success(`Welcome back, ${user.username}!`);
          return { success: true };
        } catch (err) {
          const msg = err.response?.data?.message || 'Login failed';
          set({ error: msg, isLoading: false });
          toast.error(msg);
          return { success: false, error: msg };
        }
      },

      // Logout
      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch {}
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        toast.success('Logged out successfully');
      },

      // Refresh token
      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;
        try {
          const res = await api.post('/auth/refresh', { refreshToken });
          const { accessToken, refreshToken: newRefresh } = res.data.data;
          set({ accessToken, refreshToken: newRefresh });
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          return true;
        } catch {
          get().logout();
          return false;
        }
      },

      // Update profile
      updateProfile: async (data) => {
        set({ isLoading: true });
        try {
          const res = await api.put('/auth/profile', data);
          set({ user: res.data.data.user, isLoading: false });
          toast.success('Profile updated');
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          toast.error(err.response?.data?.message || 'Update failed');
          return { success: false };
        }
      },

      // Fetch current user
      fetchMe: async () => {
        const { accessToken } = get();
        if (!accessToken) return;
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          const res = await api.get('/auth/me');
          set({ user: res.data.data.user, isAuthenticated: true });
        } catch {
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        }
      },

      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'algo-viz-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
