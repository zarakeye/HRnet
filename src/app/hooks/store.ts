import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { getCachedEmployees, saveEmployeesToCache, currentTimestamp, clearCache } from '../../utils/cacheUtils';
import type { Employee } from '../../common/types';
import { getEmployees, updateEmployee, deleteEmployee, createEmployee, getLastUpdateTimestamp } from '../api/employee.api';

export type EmployeesState = {
  employees: Employee[];
  loading: boolean;
  fetching: boolean;
  error: string | null;
  lastUpdates: number | null;
  isUpdateAvailable: boolean;
  loadEmployees: () => Promise<void>;
  fetchEmployees: () => Promise<void>;
  checkForUpdates: () => Promise<void>;
  acknowledgeUpdate: () => void;
  clearError: () => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  removeEmployee: (id: string) => Promise<void>;
};

// Clé de chiffrement (doit être stockée de manière sécurisée)
const ENCRYPTION_KEY = process.env.REACT_APP_CACHE_ENCRYPTION_KEY || 'fallback-encryption-key';

const useEmployeeStore = create<EmployeesState>()(
  devtools(
    persist(
      (set, get) => ({
        employees: [],
        loading: false,
        fetching: false,
        error: null,
        lastUpdates: null,
        isUpdateAvailable: false,

        /**
         * Tente de charger les employés à partir du cache.
         * Si le cache est vide, charge les employés depuis l'API.
         * Si une erreur se produit, stocke l'erreur dans le store.
         */
        loadEmployees: async (): Promise<void> => {
          set({ loading: true, fetching: false, error: null }, false, 'loadEmployees/start');

          try {
            const cachedEmployees = await getCachedEmployees();

            if (cachedEmployees && cachedEmployees.length > 0) {
              set({
                employees: cachedEmployees,
                loading: false,
                lastUpdates: await currentTimestamp(),
                isUpdateAvailable: false
              }, false, 'loadEmployees/success');
            } else {
              // Récupération des employés depuis l'API
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
        fetchEmployees: async () => {
          set({ fetching: true, error: null }, false, 'fetchEmployees/start');

          try {
            // Récupération des employés depuis l'API
            const freshEmployees = await getEmployees();
            set({
              employees: freshEmployees,
              fetching: false,
              lastUpdates: Date.now(),
              isUpdateAvailable: false
            }, false, 'fetchEmployees/success');

            // Sauvegarde des employés dans le cache
            await saveEmployeesToCache(freshEmployees);
            
          } catch (error: any) {
            set({
              error: error.message || 'Error fetching employees',
              loading: false
            }, false, 'fetchEmployees/error');
          }
        },

        /**
         * Checks if there are newer updates available on the server like the lastUpdated timestamp.
         * If yes, sets `isUpdateAvailable` to true.
         * If not, sets `isUpdateAvailable` to false.
         * If there is an error, sets `isUpdateAvailable` to false and logs the error.
         */
        checkForUpdates: async () => {
          const { lastUpdates } = get();

          if (lastUpdates === null) return;

          try {
            // Cette fonction devrait être implémentée dans votre API
            // Elle doit retourner le timestamp de la dernière modification
            const freshLastUpdatesTimestamp = await getLastUpdateTimestamp();

            if (freshLastUpdatesTimestamp > lastUpdates) {
              set({ isUpdateAvailable: true }, false, 'checkForUpdates/updateAvailable');
              clearCache();
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
        addEmployee: async (employee) => {
          set({ loading: true, error: null }, false, 'addEmployee/start');

          try {
            const newEmployee = await createEmployee(employee);
            set((state) => ({
              employees: [...state.employees, newEmployee],
              loading: false,
              isUpdateAvailable: true
            }), false, 'addEmployee/success');
          
            // Sauvegarde des employés dans le cache
            await saveEmployeesToCache(get().employees);
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
        updateEmployee: async (employee) => {
          set({ loading: true, error: null }, false, 'updateEmployee/start');

          try {
            const updatedEmployee = await updateEmployee(employee);
            set((state) => ({
              employees: state.employees.map(e => 
                e.id === employee.id ? updatedEmployee : e
              ),
              loading: false,
              lastUpdated: Date.now(),
            }), false, 'updateEmployee/success');

            // Sauvegarde de la modification dans le cache
            await saveEmployeesToCache(get().employees);
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
        removeEmployee: async (id) => {
          set({ loading: true, error: null }, false, 'removeEmployee/start');

          try {
            await deleteEmployee(id);
            set((state) => ({
              employees: state.employees.filter(e => e.id !== id),
              loading: false,
              lastUpdated: Date.now(),
            }), false, 'removeEmployee/success');

            // Sauvegarde de la modification dans le cache
            await saveEmployeesToCache(get().employees);
          } catch (error: any) {
            set({
              error: error?.message || 'Error removing employee',
              loading: false
            }, false, 'removeEmployee/error');
            throw error;
          }
        },
      }),
      {
        name: 'employees-storage',
        storage: createJSONStorage(() => localStorage),
        // Optionnel: ne persister que certaines propriétés
        partialize: (state) => ({
          employees: state.employees,
          lastUpdated: state.lastUpdates,
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