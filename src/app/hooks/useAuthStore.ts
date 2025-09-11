import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { login, verifyToken } from '../api/auth.api';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set/*, get*/) => ({
      token: null,
      isAuthenticated: false,
      error: null,

      login: async (password: string) => {
        try {
          const { token } = await login(password);
          set({ token, isAuthenticated: true, error: null });
          localStorage.setItem('authToken', token);
          return true;
        } catch (error: any) {
          set({ error: error?.message, isAuthenticated: false });
          return false;
        }
      },

      logout: () => {
        set({ token: null, isAuthenticated: false });
        localStorage.removeItem('authToken');
      },

      initialize: async () => {
        const token = localStorage.getItem('authToken');

        if (token) {
          // verifyToken(token)
          //   .then(() => {
          //     set({ token, isAuthenticated: true });
          //   })
          //   .catch(() => {
          //     localStorage.removeItem('authToken');
          //     set({ token: null, isAuthenticated: false });
          //   });

          try {
            await verifyToken(token);
            set({ token, isAuthenticated: true, isInitialized: true });
          } catch (error) {
            // Token invalide, le supprimer
            localStorage.removeItem('authToken');
            set({ token: null, isAuthenticated: false, isInitialized: true });
          }
        } else {
          set({ isInitialized: true });
        }
      }
    }),
    {
      name: 'AuthStore',
      version: 1
    }
  )
);

useAuthStore.getState().initialize();