import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Employee } from '../../common/types';

interface EmployeesState {
  employees: Employee[];
  addEmployee: (employee: Employee) => void;
  updateEmployee: (employee: Employee) => void;
  removeEmployee: (id: string) => void;
}

const useEmployeeStore = create<EmployeesState>()(
  devtools(
    (set) => ({
      employees: [],
      addEmployee: (employee: Employee) => set((state) => ({ employees: [...state.employees, employee] })),
      updateEmployee: (employee: Employee) => set((state) => ({ employees: state.employees.map((e) => e.id === employee.id ? employee : e) })),
      removeEmployee: (id: string) => set((state) => ({ employees: state.employees.filter((employee) => employee.id !== id) })),
    }),
  )
);

export default useEmployeeStore;