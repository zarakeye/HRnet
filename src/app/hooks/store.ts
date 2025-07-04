import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Employee } from '../../common/types';
import { getEmployees, updateEmployee, deleteEmployee, createEmployee } from '../api/employee.api';

interface EmployeesState {
  employees: Employee[];
  loadEmployees: () => Promise<void>;
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (employee: Employee) => void;
  removeEmployee: (id: string) => void;
}

const useEmployeeStore = create<EmployeesState>()(
  devtools(
    (set) => ({
      employees: [],
      loadEmployees: async () => {
        const data = await getEmployees();
        set({ employees: data });
      },
      // addEmployee: (employee: Employee) => set((state) => ({ employees: [...state.employees, employee] })),
      addEmployee: async (employee) => {
        const newEmployee = await createEmployee(employee);
        set((state) => ({ employees: [...state.employees, newEmployee] }));
      },
      // updateEmployee: (employee: Employee) => set((state) => ({ employees: state.employees.map((e) => e.id === employee.id ? employee : e) })),
      updateEmployee: async (employee) => {
        const updatedEmployee = await updateEmployee(employee);
        set((state) => ({ employees: state.employees.map((e) => e.id === employee.id ? updatedEmployee : e) }));
      },
      // removeEmployee: (id: string) => set((state) => ({ employees: state.employees.filter((employee: loyee) => employee.id !== id) })),
      removeEmployee: async (id) => {
        await deleteEmployee(id);
        set((state) => ({ employees: state.employees.filter((employee: Employee) => employee.id !== id) }));
      },
    }),
  )
);

export default useEmployeeStore;