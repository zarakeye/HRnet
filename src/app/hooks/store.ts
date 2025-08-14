import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getCachedEmployees, saveEmployeesToCache } from '../../utils/cacheUtils';
import type { Employee } from '../../common/types';
import { getEmployees, updateEmployee, deleteEmployee, createEmployee } from '../api/employee.api';

export type EmployeesState = {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  cacheVersion: number;
  hasChanges: boolean;
  
  loadEmployees: (preventInterval?: boolean) => Promise<void>;
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  removeEmployee: (id: string) => Promise<void>;
  silentUpdate: (employees: Employee[]) => void;
};

const useEmployeeStore = create<EmployeesState>()(devtools((set, get) => ({
  employees: [],
  loading: false,
  error: null,
  lastFetched: null,
  cacheVersion: 0,
  hasChanges: false,

  silentUpdate: (employees) => {
    set({ employees, hasChanges: true });
  },

  loadEmployees: async (preventInterval = false) => {
    const cachedEmployees = await getCachedEmployees();
    if (cachedEmployees.length > 0) {
      set({ employees: cachedEmployees });
    }

    set({ loading: true, error: null });

    try {
      const freshEmployees = await getEmployees();
      const now = Date.now();
      const currentEmployees = get().employees;

      // Vérification des changements
      const hasChanges = (
        freshEmployees.length !== currentEmployees.length ||
        freshEmployees.some((emp, i) => 
          emp.id !== currentEmployees[i]?.id || 
          JSON.stringify(emp) !== JSON.stringify(currentEmployees[i])
        )
      );

      if (hasChanges) {
        set({
          employees: freshEmployees,
          loading: false,
          lastFetched: now,
          hasChanges: true,
          cacheVersion: get().cacheVersion + 1
        });
        await saveEmployeesToCache(freshEmployees);
      } else {
        set({
          lastFetched: now,
          loading: false
        });
      }

      // Planification du prochain rafraîchissement
      if (!preventInterval) {
        setTimeout(() => {
          get().loadEmployees();
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

  addEmployee: async (employee) => {
    set({ loading: true });
    try {
      const newEmployee = await createEmployee(employee);
      set((state) => ({
        employees: [...state.employees, newEmployee],
        loading: false,
        cacheVersion: state.cacheVersion + 1,
        hasChanges: true
      }));
      await saveEmployeesToCache(get().employees);
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateEmployee: async (employee) => {
    set({ loading: true });
    try {
      const updatedEmployee = await updateEmployee(employee);
      set((state) => ({
        employees: state.employees.map(e => 
          e.id === employee.id ? updatedEmployee : e
        ),
        loading: false,
        cacheVersion: state.cacheVersion + 1,
        hasChanges: true
      }));
      await saveEmployeesToCache(get().employees);
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  removeEmployee: async (id) => {
    set({ loading: true });
    try {
      await deleteEmployee(id);
      set((state) => ({
        employees: state.employees.filter(e => e.id !== id),
        loading: false,
        cacheVersion: state.cacheVersion + 1,
        hasChanges: true
      }));
      await saveEmployeesToCache(get().employees);
    } catch (error: any) {
      set({ error: error?.message, loading: false });
    }
  },
})));

export default useEmployeeStore;