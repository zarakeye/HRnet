import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Employee } from '../../common/types';
import { getEmployees, updateEmployee, deleteEmployee, createEmployee, getLastUpdateTimestamp } from '../api/employee.api';
import { getCachedData, setCachedData } from '../api/cache.api';
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
       * Tente de charger les employés à partir du cache.
       * Si le cache est vide, charge les employés depuis l'API.
       * Si une erreur se produit, stocke l'erreur dans le store.
       */
      loadEmployees: async (): Promise<void> => {
        const { token, encryptionPassword } = useAuthStore.getState();
        console.log('token: ', token);

        if (!token || !encryptionPassword) {
          set({
            error: 'Authentification required',
            loading: false
          })
          return;
        }

        set({ loading: true, error: null }, false, 'loadEmployees/start');

        try {
          // Try to fetch from cache
          try {
            const cachedData = await getCachedData('employees', token, encryptionPassword);

            if (cachedData) {
              const decryptedData = JSON.parse(cachedData.encrypted);

              if (decryptedData && decryptedData.employees) {
                set({
                  employees: decryptedData.employees,
                  loading: false,
                  lastUpdate: decryptedData.lastUpdate,
                  isUpdateAvailable: false,
                }, false, 'loadEmployees/success');
              }

              // Vérify in background if an update is available
              get().checkForUpdate();
              return;
            }
          } catch (error: any) {
            if (error.message === 'FORBIDDEN') {
              // Token invalide, déconnecter l'utilisateur
              useAuthStore.getState().logout();
              set({ error: 'Session expired, please login again', loading: false });
              return;
            }
            console.log('No cached data available, fetching fresh data');
          }

          // if cache is empty or failed, fetch fresh data
          get().fetchEmployees();
        } catch (error: any) {
          set({
            error: error?.message || 'Error loading employees',
            loading: false,
          });
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
        const {token, encryptionPassword } = useAuthStore.getState();

        if (!token || !encryptionPassword) {
          set({
            error: 'Authentification required',
            fetching: false
          })
          return;
        }

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

          // Update cache
          await setCachedData(
            'employees',
            { employees: freshEmployees, lastUpdated: Date.now() },
            CACHE_TTL,
            token,
            encryptionPassword
          );
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
       * Checks if there are newer updates available on the server like the lastUpdated timestamp.
       * If yes, sets `isUpdateAvailable` to true.
       * If not, sets `isUpdateAvailable` to false.
       * If there is an error, sets `isUpdateAvailable` to false and logs the error.
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
            // get().fetchEmployees();
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
        const { token, encryptionPassword} = useAuthStore.getState();

        if (!token || !encryptionPassword) {
          set({ error: 'Authentication required', loading: false });
          throw new Error('Authentication required');
        }

        set({ loading: true, error: null }, false, 'addEmployee/start');

        try {
          const newEmployee = await createEmployee(employee);
          set((state) => ({
            employees: [...state.employees, newEmployee],
            loading: false,
            lastUpdate: Date.now(),
          }), false, 'addEmployee/success');

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
       * Removes an employee from the list of employees.
       * @param id The id of the employee to remove.
       * @returns A promise that resolves when the employee is removed, or
       * rejects with an error if something goes wrong.
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