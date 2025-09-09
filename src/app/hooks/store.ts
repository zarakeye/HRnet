import { create } from 'zustand';
import { devtools, persist, PersistStorage } from 'zustand/middleware';
import type { Employee } from '../../common/types';
import { getEmployees, updateEmployee, deleteEmployee, createEmployee, getLastUpdateTimestamp } from '../api/employee.api';
import CryptoJS from 'crypto-js';
import { StorageValue } from 'zustand/middleware';

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Encryption configuration
const ENCRYPTION_CONFIG = {
  keySize: 256 / 32,
  iterations: 100000,
}

const createEncryptedStorage = (password: string): PersistStorage<{ employees: Employee[]; lastUpdate: number | null; }> => {
  return {
    getItem: async (name: string): Promise<StorageValue<{ employees: Employee[]; lastUpdate: number | null; }> | null> => {
      try {
        const cipherText = localStorage.getItem(name);
        
        if (!cipherText) {
          return null;
        }

        // Extract salt and encrypted data 
        const storedData = JSON.parse(cipherText);
        const salt = CryptoJS.enc.Hex.parse(storedData.salt);
        const key = CryptoJS.PBKDF2(password, salt, ENCRYPTION_CONFIG);

        // Decrypt data
        const bytes = CryptoJS.AES.decrypt(storedData.cipherText, key)
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

        // Parse decrypted data into a StorageValue object
        const parsedData: StorageValue<{ employees: Employee[]; lastUpdate: number | null; }> = JSON.parse(decryptedData);

        return parsedData;
      } catch (error) {
        console.error('Error decrypting data:', error);
        return null;
      }
    },

    setItem: async (name: string, value: StorageValue<{ employees: Employee[]; lastUpdate: number | null; }>): Promise<void> => {
      try {
        // Generate salt
        const salt = CryptoJS.lib.WordArray.random(128 / 8);

        // Derive key 
        const key = CryptoJS.PBKDF2(password, salt, ENCRYPTION_CONFIG);
        
        // Encrypt data
        const cipherText = CryptoJS.AES.encrypt(JSON.stringify(value), key).toString();

        // Store salt and encrypted data
        const storedData = JSON.stringify({
          salt: salt.toString(CryptoJS.enc.Hex),
          cipherText
        });

        localStorage.setItem(name, storedData);
      } catch (error) {
        console.error('Error encrypting data:', error);
      }
    },

    removeItem: async (name: string): Promise<void> => {
      localStorage.removeItem(name);
    }
  }
}

export type EmployeesState = {
  employees: Employee[];
  loading: boolean;
  fetching: boolean;
  error: string | null;
  lastUpdate: number | null;
  isUpdateAvailable: boolean;
  password: string | null;
  setPassword: (password: string) => void;
  loadEmployees: () => Promise<void>;
  fetchEmployees: () => Promise<void>;
  checkForUpdate: () => Promise<void>;
  acknowledgeUpdate: () => void;
  clearError: () => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  removeEmployee: (id: string) => Promise<void>;
  clearCache: () => void;
};

let tempPassword: string | null = null;

const useEmployeeStore = create<EmployeesState>()(
  devtools(
    persist(
      (set, get) => ({
        employees: [],
        loading: false,
        fetching: false,
        error: null,
        lastUpdate: null,
        isUpdateAvailable: false,
        password: null,

        /**
         * Set the password used to encrypt and decrypt the data.
         * @param {string} password The password to set.
         */
        setPassword: (password: string) => {
          tempPassword = password;
          set({ password });
        },

        /**
         * Tente de charger les employés à partir du cache.
         * Si le cache est vide, charge les employés depuis l'API.
         * Si une erreur se produit, stocke l'erreur dans le store.
         */
        loadEmployees: async (): Promise<void> => {
          const { password, lastUpdate } = get();
          const currentPassword = password || tempPassword;

          if (!currentPassword) {
            set({
              error: 'Password not set',
              loading: false
            })
            return;
          }

          set({ loading: true, fetching: false, error: null }, false, 'loadEmployees/start');

          try {
            // Check if cache is valid
            if (lastUpdate && Date.now() - lastUpdate < CACHE_TTL) {
              // Use cache
              set({ loading: false });
              // Check for update in background
              get().checkForUpdate();
            } else {
              // Cache is empty or expired, Fetch from API
              get().fetchEmployees();
            }
          } catch (error: any) {
            set({
              error: error.message || 'Error fetching employees',
              loading: false
            }, false, 'loadEmployees/error');
          }
        },
        
        /**
         * Fetches the list of employees from the API or from the cache.
         * If `force` is `true`, it will always fetch from the API, otherwise it will first try to fetch from the cache.
         * If the cache is empty or the fetch from the cache fails, it will fetch from the API.
         * It saves the fetched employees in the cache.
         * It sets the `loading` state to `true` while fetching and sets the `error` state if an error occurs.
         * It sets the `lastUpdated` state with the current timestamp and the `isUpdateAvailable` state to `false`.
         * @param {boolean} force if `true`, it will always fetch from the API, otherwise it will first try to fetch from the cache.
         */
        fetchEmployees: async (): Promise<void> => {
          const { password } = get();
          const currentPassword = password || tempPassword;

          if (!currentPassword) {
            set({
              error: 'Password not set',
              fetching: false
            })
            return;
          }

          // Try to fetch
          set({
            fetching: true,
            error: null,
          }, false, 'fetchEmployees/start');

          try {
            const freshEmployees = await getEmployees();

            set({
              employees: freshEmployees,
              fetching: false,
              lastUpdate: Date.now(),
              isUpdateAvailable: false
            }, false, 'fetchEmployees/success');
          } catch (error: any) {
            set({
              error: error.message || 'Error fetching employees',
              fetching: false
            }, false, 'fetchEmployees/error');
          }
        },

        /**
         * Checks if there are newer updates available on the server like the lastUpdated timestamp.
         * If yes, sets `isUpdateAvailable` to true.
         * If not, sets `isUpdateAvailable` to false.
         * If there is an error, sets `isUpdateAvailable` to false and logs the error.
         */
        checkForUpdate: async (): Promise<void> => {
          const { lastUpdate, password } = get();
          const currentPassword = password || tempPassword;

          if (!currentPassword || lastUpdate === null) return;

          try {
            // Cette fonction devrait être implémentée dans votre API
            // Elle doit retourner le timestamp de la dernière modification
            const freshLastUpdatesTimestamp = await getLastUpdateTimestamp();

            if (freshLastUpdatesTimestamp > lastUpdate) {
              set({ isUpdateAvailable: true }, false, 'checkForUpdates/updateAvailable');
              get().fetchEmployees();
            }
          } catch (error: any) {
            console.error('Error checking for updates:', error);
          }
        },

        /**
         * Resets the `isUpdateAvailable` flag to false, indicating that the
         * user has acknowledged the available update.
         */
        acknowledgeUpdate: () => {
          set({ isUpdateAvailable: false }, false, 'acknowledgeUpdate');
        },

        /**
         * Resets the `error` field to null, effectively clearing the
         * last error that occurred.
         */
        clearError: () => {
          set({ error: null }, false, 'clearError');
        },
      
        /**
         * Adds a new employee to the list of employees.
         * @param employee The employee to add, with all fields except `id` set.
         * @returns A promise that resolves when the employee is added, or rejects
         * with an error if something goes wrong.
         */
        addEmployee: async (employee: Omit<Employee, 'id'>): Promise<void> => {
          const { password } = get();
          const currentPassword = password || tempPassword;

          if (!currentPassword) {
            set({
              error: 'Password not set',
              loading: false
            })
            
            throw new Error('Password not set');
          }

          set({ loading: true, error: null }, false, 'addEmployee/start');

          try {
            const newEmployee = await createEmployee(employee);
            set((state) => ({
              employees: [...state.employees, newEmployee],
              loading: false,
              lastUpdate: Date.now(),
            }), false, 'addEmployee/success');
          } catch (error: any) {
            set({
              error: error.message,
              loading: false
            }, false, 'addEmployee/error');
            throw error;
          }
        },

        /**
         * Updates an existing employee in the list of employees.
         * @param employee The employee to update, with all fields except `id`
         * set to the new values.
         * @returns A promise that resolves when the employee is updated, or
         * rejects with an error if something goes wrong.
         */
        updateEmployee: async (employee: Employee) => {
          const { password } = get();
          const currentPassword = password || tempPassword;

          if (!currentPassword) {
            set({
              error: 'Password not set',
              loading: false
            })
            throw new Error('Password not set');
          }

          set({ loading: true, error: null }, false, 'updateEmployee/start');

          try {
            const updatedEmployee = await updateEmployee(employee);
            set((state) => ({
              employees: state.employees.map(e => 
                e.id === employee.id ? updatedEmployee : e
              ),
              loading: false,
              lastUpdate: Date.now(),
            }), false, 'updateEmployee/success');
          } catch (error: any) {
            set({
              error: error.message || 'Error updating employee',
              loading: false
            }, false, 'updateEmployee/error');
            throw error;
          }
        },

        /**
         * Removes an employee from the list of employees.
         * @param id The id of the employee to remove.
         * @returns A promise that resolves when the employee is removed, or
         * rejects with an error if something goes wrong.
         */
        removeEmployee: async (id: string): Promise<void> => {
          const { password } = get();
          const currentPassword = password || tempPassword;

          if (!currentPassword) {
            set({
              error: 'Password not set',
              loading: false
            })
            throw new Error('Password not set');
          }

          set({ loading: true, error: null }, false, 'removeEmployee/start');

          try {
            await deleteEmployee(id);
            set((state) => ({
              employees: state.employees.filter(e => e.id !== id),
              loading: false,
              lastUpdate: Date.now(),
            }), false, 'removeEmployee/success');
          } catch (error: any) {
            set({
              error: error?.message || 'Error removing employee',
              loading: false
            }, false, 'removeEmployee/error');
            throw error;
          }
        },

        clearCache: (): void => {
          set({
            employees: [],
            lastUpdate: null,
            isUpdateAvailable: false
          }, false, 'clearCache');
        }
      }),
      {
        name: 'employees-storage',
        storage: createEncryptedStorage(tempPassword || 'PlaceholderPassword'),
        // Optionnel: ne persister que certaines propriétés
        partialize: (state: EmployeesState ) => ({
          employees: state.employees,
          lastUpdate: state.lastUpdate,
        }),
      }
    ),
    {
      name: 'EmployeeStore',
      enabled: true
    }
  )
);

export default useEmployeeStore;