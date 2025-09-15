import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { login, verifyToken } from '../api/auth.api';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  error: string | null;
  isInitialized: boolean;
  encryptionPassword: string | null;
  login: (password: string) => Promise<boolean>;
  setEncryptionPassword: (password: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set/*, get*/) => ({
      token: null,
      isAuthenticated: false,
      error: null,
      encryptionPassword: null,

      /**
       * Logs in the user using the provided password.
       * If the login is successful, sets the `token`, `isAuthenticated` and `encryptionPassword` states.
       * Saves the token and encryption password to local storage.
       * Returns a boolean indicating whether the login was successful or not.
       * @param {string} password The password to use for logging in.
       * @returns {Promise<boolean>} A promise resolving to a boolean indicating whether the login was successful or not.
       */
      login: async (password: string): Promise<boolean> => {
        try {
          const { token } = await login(password);
          set({ token, isAuthenticated: true, error: null, encryptionPassword: password });
          localStorage.setItem('authToken', token);
          localStorage.setItem('encryptionPassword', password);
          return true;
        } catch (error: any) {
          set({ error: error?.message, isAuthenticated: false });
          return false;
        }
      },

      /**
       * Sets the encryption password used for encrypting and decrypting the employee data.
       * Saves the encryption password to local storage.
       * @param {string} password The new encryption password to set.
       */
      setEncryptionPassword: (password: string) => {
        set({ encryptionPassword: password });
        localStorage.setItem('encryptionPassword', password);
      },

      /**
       * Logs the user out by removing the authentication token and encryption password from local storage.
       */
      logout: () => {
        set({ token: null, isAuthenticated: false });
        localStorage.removeItem('authToken');
        localStorage.removeItem('encryptionPassword');
      },

      /**
       * Initializes the authentication state by checking if a valid token and encryption password are saved in local storage.
       * If a valid token is found, it sets the `token`, `isAuthenticated` and `encryptionPassword` states.
       * If an invalid token is found, it removes the token and encryption password from local storage and sets the `token` and `isAuthenticated` states to `null` and `false` respectively.
       * If no token is found, it sets the `isInitialized` state to `true`.
       */
      initialize: async () => {
        const token = localStorage.getItem('authToken');
        const encryptionPassword  = localStorage.getItem('encryptionPassword');

        if (token) {
          try {
            await verifyToken(token);
            set({ token, isAuthenticated: true, isInitialized: true, encryptionPassword });
          } catch (error) {
            // Token invalide, le supprimer
            localStorage.removeItem('authToken');
            localStorage.removeItem('encryptionPassword');
            set({ token: null, isAuthenticated: false, isInitialized: true, encryptionPassword: null });
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