import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getCachedEmployees, saveEmployeesToCache } from '../../utils/cacheUtils';
import type { Employee } from '../../common/types';
import { getEmployees, updateEmployee, deleteEmployee, createEmployee } from '../api/employee.api';

export type EmployeesState = {
  employees: Employee[];
  cachedEmployees: Employee[]; // for the data freshly fetched
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  isUpdateAvailable: boolean;
  loadEmployees: (preventInterval?: boolean) => Promise<void>;
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (employee: Employee) => Promise<void>;
  removeEmployee: (id: string) => Promise<void>;
  silentUpdate: (employees: Employee[]) => void;
  applyUpdates: () => void;
};

const useEmployeeStore = create<EmployeesState>()(devtools((set, get) => ({
  employees: [],
  cachedEmployees: [],
  loading: false,
  error: null,
  lastFetched: null,
  isUpdateAvailable: false,

  silentUpdate: (employees) => {
    set({ employees, isUpdateAvailable: true });
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

      // Créez des maps pour une comparaison efficace
      const currentMap = new Map(currentEmployees.map(emp => [emp.id, emp.lastModified]));
      const freshMap = new Map(freshEmployees.map(emp => [emp.id, emp.lastModified]));

      // Vérifiez s'il y a des différences
      let hasChanges = false;

      // 1. Vérifiez les modifications ou suppressions
      for (const [id, lastModified] of currentMap) {
        if (!freshMap.has(id) || freshMap.get(id) !== lastModified) {
          hasChanges = true;
          break;
        }
      }

      if (!hasChanges && freshMap.size !== currentMap.size) {
        hasChanges = true;
      }

      if (hasChanges) {
        set({
          cachedEmployees: freshEmployees,
          loading: false,
          lastFetched: now,
          isUpdateAvailable: true,
        });
        // await saveEmployeesToCache(freshEmployees);
      } else {
        set({
          lastFetched: now,
          loading: false,
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
        isUpdateAvailable: true
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
        isUpdateAvailable: true
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
        isUpdateAvailable: true
      }));
      await saveEmployeesToCache(get().employees);
    } catch (error: any) {
      set({ error: error?.message, loading: false });
    }
  },

  applyUpdates: () => {
    set((state) => {
      saveEmployeesToCache(state.employees);

      return {
        employees: state.cachedEmployees,
        isUpdateAvailable: false
      };
    });
  }
})));

export default useEmployeeStore;