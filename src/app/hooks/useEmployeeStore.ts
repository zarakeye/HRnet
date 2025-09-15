import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Employee } from '../../common/types';
import { getEmployees, updateEmployee, deleteEmployee, createEmployee, getLastUpdateTimestamp } from '../api/employee.api';
import { getCachedData, setCachedData, checkCacheAvailability } from '../api/cache.api';
import { useAuthStore } from './useAuthStore';

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export type EmployeesState = {
  employees: Employee[];
  loading: boolean;
  fetching: boolean;
  error: string | null;
  lastUpdate: number | null;
  isUpdateAvailable: boolean;
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

const useEmployeeStore = create<EmployeesState>()(
  devtools(
    (set, get) => ({
      employees: [],
      loading: false,
      fetching: false,
      error: null,
      lastUpdate: null,
      isUpdateAvailable: false,
      /**
       * Loads the employees from the cache or the API.
       * If the token is invalid, logs the user out and throws an error.
       * If the cache is available and the encryption password is valid, it
       * fetches the employees from the cache and sets the `lastUpdate` state.
       * If the cache is unavailable, it fetches fresh employees from the API.
       * If an error occurs while loading the employees, it sets an error state
       * and logs an error to the console.
       */
      loadEmployees: async (): Promise<void> => {
        const { token, encryptionPassword } = useAuthStore.getState();
        
        if (!token) {
          set({ error: 'Authentication required', loading: false });
          return;
        }

        set({ loading: true, error: null });

        try {
          // Vérifier la disponibilité du cache
          const cacheAvailable = await checkCacheAvailability(token);
          
          if (cacheAvailable && encryptionPassword) {
            try {
              const cachedData = await getCachedData('employees', token, encryptionPassword);

              if (cachedData && cachedData.employees) {
                set({
                  employees: cachedData.employees,
                  lastUpdate: cachedData.lastUpdated,
                  loading: false
                });
                
                get().checkForUpdate();
                return;
              }
            } catch (error: any) {
              console.log('Cache unavailable, fetching fresh data', error);
            }
          }
          
          await get().fetchEmployees();
        } catch (error: any) {
          console.error('Error in loadEmployees:', error);
          set({ error: error.message, loading: false });
        }
      },
      /**
       * Fetches fresh employees from the API.
       * If the token is invalid, logs the user out and throws an error.
       * If the fetch is successful, updates the cache.
       * If the fetch fails, sets an error state and throws an error.
       * @throws Error If the token is invalid or the fetch fails.
       */
      fetchEmployees: async (): Promise<void> => {
        const {token, encryptionPassword } = useAuthStore.getState();

        if (!token || !encryptionPassword) {
          set({
            error: 'Authentification required',
            fetching: false,
          })
          return;
        }

        set({
          fetching: true,
          error: null,
        }, false, 'fetchEmployees/start');

        try {
          console.log('Fetching fresh employees from API');
          const freshEmployees = await getEmployees();
          console.log('Fresh employees received:', freshEmployees);

          // Vérifier que les données sont valides avant de les stocker
          if (!Array.isArray(freshEmployees)) {
            throw new Error('Invalid data received from server');
          }

          set({
            employees: freshEmployees,
            fetching: false,
            lastUpdate: Date.now(),
            isUpdateAvailable: false,
            error: null,
            loading: false
          }, false, 'fetchEmployees/success');

          if (freshEmployees.length > 0) {
            // Mettre à jour le cache
            try {
              console.log('Updating cache with fresh data');
              await setCachedData(
                'employees', 
                { employees: freshEmployees, lastUpdated: Date.now() },
                CACHE_TTL,
                token,
                encryptionPassword
              );
              console.log('Cache updated successfully');
            } catch (cacheError) {
              console.error('Error updating cache:', cacheError);
              // Ne pas propager l'erreur car les données fraîches ont été récupérées avec succès
            }
          } else {
            console.log('No data to cache - Employees array is empty');
          }
        } catch (error: any) {
          if (error.message === 'FORBIDDEN') {
            // Token invalide, déconnecter l'utilisateur
            useAuthStore.getState().logout();
            set({ error: 'Session expired, please login again', fetching: false });
            return;
          }

          set({
            error: error.message || 'Error fetching employees',
            fetching: false
          }, false, 'fetchEmployees/error');
        }
      },
      /**
       * Checks if an update is available by comparing the last update timestamp
       * stored in the cache with the latest timestamp from the API.
       * If the latest timestamp is greater than the last update timestamp, it
       * sets the `isUpdateAvailable` state to `true`.
       * If the token is invalid or the last update timestamp is null, it returns
       * immediately without doing anything.
       * If an error occurs while checking for updates, it sets the `isUpdateAvailable`
       * state to `false` and logs an error to the console.
       */
      checkForUpdate: async (): Promise<void> => {
        const { lastUpdate } = get();
        const token = useAuthStore.getState().token;

        if (!token || lastUpdate === null) {
          return;
        }

        try {
          // Cette fonction devrait être implémentée dans votre API
          // Elle doit retourner le timestamp de la dernière modification
          const freshLastUpdatesTimestamp = await getLastUpdateTimestamp();

          if (freshLastUpdatesTimestamp > lastUpdate) {
            set({ isUpdateAvailable: true }, false, 'checkForUpdates/updateAvailable');
          }
        } catch (error: any) {
          if (error.message === 'FORBIDDEN') {
            // Token invalide, déconnecter l'utilisateur
            useAuthStore.getState().logout();
            set({ error: 'Session expired, please login again', fetching: false });
            return;
          }
          console.error('Error checking for updates:', error);
          set({ isUpdateAvailable: false }, false, 'checkForUpdates/error');
        }
      },
      /**
       * Acknowledge that an update is available.
       * This will reset the `isUpdateAvailable` state to `false`.
       */
      acknowledgeUpdate: () => {
        set({ isUpdateAvailable: false }, false, 'acknowledgeUpdate');
      },
      clearError: () => {
        set({ error: null }, false, 'clearError');
      },
      addEmployee: async (employee: Omit<Employee, 'id'>): Promise<void> => {
        const { token, encryptionPassword} = useAuthStore.getState();
        console.log(`Token: ${token}, Password: ${encryptionPassword}`);

        if (!token || !encryptionPassword) {
          set({ error: 'Authentication required', loading: false });
          throw new Error('Authentication required');
        }

        set({ loading: true, error: null }, false, 'addEmployee/start');

        try {
          const newEmployee = await createEmployee(employee);
          console.log('newEmployee: ', newEmployee);
          set((state) => ({
            employees: [...state.employees, newEmployee],
            loading: false,
            lastUpdate: Date.now(),
          }), false, 'addEmployee/success');

          try {
            await setCachedData(
              'employees',
              { employees: get().employees, lastUpdated: Date.now() },
              CACHE_TTL,
              token,
              encryptionPassword
            );
          } catch (cacheError) {
            console.error('Error updating cache:', cacheError);
          }
        } catch (error: any) {
          console.error('Error adding employee:', error);
          set({
            error: error.message,
            loading: false
          }, false, 'addEmployee/error');
          throw error;
        }
      },
      /**
       * Updates an employee in the store.
       * If the token is invalid, logs the user out and throws an error.
       * If the update is successful, updates the cache.
       * If the update fails, sets an error state and throws an error.
       * @param employee The employee to update.
       * @throws Error If the token is invalid or the update fails.
       */
      updateEmployee: async (employee: Employee) => {
        const { token, encryptionPassword} = useAuthStore.getState();

        if (!token || !encryptionPassword) {
          set({ error: 'Authentication required', loading: false });
          throw new Error('Authentication required');
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

          // Update cache
          await setCachedData(
            'employees',
            { employees: get().employees, lastUpdated: Date.now() },
            CACHE_TTL,
            token,
            encryptionPassword
          );
        } catch (error: any) {
          if (error.message === 'FORBIDDEN') {
            // Token invalide, déconnecter l'utilisateur
            useAuthStore.getState().logout();
            set({ error: 'Session expired, please login again', loading: false });
            return;
          }

          set({
            error: error.message || 'Error updating employee',
            loading: false
          }, false, 'updateEmployee/error');
          throw error;
        }
      },
      /**
       * Removes an employee from the store.
       * If the token is invalid, logs the user out and throws an error.
       * If the deletion is successful, updates the cache.
       * If the deletion fails, sets an error state and throws an error.
       * @param id The id of the employee to remove.
       * @throws Error If the token is invalid or the deletion fails.
       */
      removeEmployee: async (id: string): Promise<void> => {
        const { token, encryptionPassword } = useAuthStore.getState();
        if (!token || !encryptionPassword) {
          set({ error: 'Authentication required', loading: false });
          throw new Error('Authentication required');
        }

        set({ loading: true, error: null }, false, 'removeEmployee/start');

        try {
          await deleteEmployee(id);
          set((state) => ({
            employees: state.employees.filter(e => e.id !== id),
            loading: false,
            lastUpdate: Date.now(),
          }), false, 'removeEmployee/success');

          // Update cache
          await setCachedData(
            'employees',
            { employees: get().employees, lastUpdated: Date.now() },
            CACHE_TTL,
            token,
            encryptionPassword
          );
        } catch (error: any) {
          if (error.message === 'FORBIDDEN') {
            // Token invalide, déconnecter l'utilisateur
            useAuthStore.getState().logout();
            set({ error: 'Session expired, please login again', loading: false });
            return;
          }

          set({
            error: error?.message || 'Error removing employee',
            loading: false
          }, false, 'removeEmployee/error');
          throw error;
        }
      },

      /**
       * Clears the EmployeeStore state, removing all employees and resetting
       * the lastUpdate and isUpdateAvailable flags.
       */
      clearCache: (): void => {
        set({
          employees: [],
          lastUpdate: null,
          isUpdateAvailable: false
        }, false, 'clearCache');
      }
    }),
    {
      name: 'EmployeeStore',
      enabled: true
    }
  )
);

export default useEmployeeStore;