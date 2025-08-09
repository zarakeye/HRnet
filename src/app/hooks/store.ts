import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Employee } from '../../common/types';
import { getEmployees, updateEmployee, deleteEmployee, createEmployee } from '../api/employee.api';
// import { error } from 'console';

interface EmployeesState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null; // Ajout pour suivre le dernier chargement
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

      /**
       * Fetches the list of employees from the API and updates the state with the fetched data.
       * It retrieves the employees using the getEmployees function and sets the employees in the store.
       * Throws an error if the fetch operation fails.
       */
      loadEmployees: async (preventInterval = false) => {
        // const data = await getEmployees();
        
        if (get().lastFetched && Date.now() -  Number(get().lastFetched) < 4 * 60 * 1000) {
          return;
        }
        
        set({ loading: true, error: null });

        try {
          const data = await getEmployees();
          const now = Date.now();

          set({
            employees: data,
            loading: false,
            lastFetched: now // Enregistrer le moment du chargement
          });

          if (!preventInterval) {
            setTimeout(() => {
              get().loadEmployees()
            }, 4 * 60 * 1000 + Math.random() * 30 * 1000);
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
            loading: false
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
            loading: false
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
            loading: false
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