import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Employee /*, EmployeesState*/ } from '../../common/types';

interface EmployeesState {
  employees: Employee[];
  addEmployee: (employee: Employee) => void;
  addEmployees: (employees: Employee[]) => void;
  updateEmployee: (employee: Employee) => void;
  removeEmployee: (id: string) => void;
  resetEmployeesList: () => void;
}

const useEmployeeStore = create<EmployeesState>()(
  devtools(
    (set) => ({
      employees: [],
      addEmployee: (employee: Employee) => set((state) => ({ employees: [...state.employees, employee] })),
      addEmployees: (employees: Employee[]) => set((state) => ({ employees: [...state.employees, ...employees] })),
      updateEmployee: (employee: Employee) => set((state) => ({ employees: state.employees.map((e) => e.id === employee.id ? employee : e) })),
      removeEmployee: (id: string) => set((state) => ({ employees: state.employees.filter((employee) => employee.id !== id) })),
      resetEmployeesList: () => set({ employees: [] }),
    }),
  )
);

export default useEmployeeStore;