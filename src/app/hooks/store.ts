import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getCachedEmployees, saveEmployeesToCache } from '../../utils/cacheUtils';
import type { Employee } from '../../common/types';
import { getEmployees, updateEmployee, deleteEmployee, createEmployee } from '../api/employee.api';
// import { error } from 'console';

interface EmployeesState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  cacheVersion: number;
  hasChanges: boolean; // Ajout pour suivre le dernier chargement
  loadEmployees: () => Promise<void>;
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (employee: Employee) => void;
  removeEmployee: (id: string) => void;
}

const useEmployeeStore = create<EmployeesState>()(
  devtools(
    (set, get) => ({
      employees: [],
      loading: false,
      error: null,
      lasFetched: null,
      cacheVersion: 0, // To track cache changes
      hasChanges: false, // New state to detect changes

      /**
       * Fetches the list of employees from the API and updates the state with the fetched data.
       * It retrieves the employees using the getEmployees function and sets the employees in the store.
       * Throws an error if the fetch operation fails.
       */
      loadEmployees: async (preventInterval = false) => {
        // 1. Verify the cache first
        const cachedEmployees = await getCachedEmployees();
        
        if (cachedEmployees.length > 0) {
          set({ employees: cachedEmployees });
        }
        
        // 2. Load fresh data
        set({ loading: true, error: null });

        try {
          const freshEmployees = await getEmployees();
          const now = Date.now();

          // 3. Check if there are changes
          const changesDetected = JSON.stringify(freshEmployees) !== JSON.stringify(get().employees);

          set({
            employees: freshEmployees,
            loading: false,
            lastFetched: now, // Enregistrer le moment du chargement
            hasChanges: changesDetected,
            cacheVersion: get().cacheVersion + 1
          });

          // 4. Save to cache
          await saveEmployeesToCache(freshEmployees);

          5. // Schedule the next load
          if (!preventInterval) {
            setTimeout(() => {
              get().loadEmployees()
            }, 4 * 60 * 1000 + Math.random() * 60 * 1000);
          }
        } catch (error: any) {
          set({
            error: error.message,
            loading: false,
            lastFetched: Date.now()
          });

          setTimeout(() => {
            get().loadEmployees();
          }, 30 * 1000);
        }
      },
      // addEmployee: (employee: Employee) => set((state) => ({ employees: [...state.employees, employee] })),
      addEmployee: async (employee) => {
        set({ loading: true });
        try {
          const newEmployee = await createEmployee(employee);
          set((state) => ({
            employees: [...state.employees, newEmployee],
            loading: false,
            cacheVersion: state.cacheVersion + 1
          }));
        } catch (error: any) {
          set({
            error: error.message,
            loading: false
          });
        }
      },
      // updateEmployee: (employee: Employee) => set((state) => ({ employees: state.employees.map((e) => e.id === employee.id ? employee : e) })),
      updateEmployee: async (employee) => {
        set({ loading: true });
        try {
          const updatedEmployee = await updateEmployee(employee);
          set((state) => ({
            employees: state.employees.map((e) => e.id === employee.id ? updatedEmployee : e),
            loading: false,
            cacheVersion: state.cacheVersion + 1
          }));
        } catch (error: any) {
          set({
            error: error.message,
            loading: false
          })
        }
      },

      // removeEmployee: (id: string) => set((state) => ({ employees: state.employees.filter((employee: loyee) => employee.id !== id) })),
      removeEmployee: async (id) => {
        set({ loading: true });
        try {
          await deleteEmployee(id);
          set((state) => ({
            employees: state.employees.filter((employee: Employee) => employee.id !== id),
            loading: false,
            cacheVersion: state.cacheVersion + 1
          }));
        } catch (error: any) {
          set({
            error: error?.message,
            loading: false
          });
        }
      },
    }),
  )
);

export default useEmployeeStore;