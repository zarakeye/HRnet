import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import type { Employee/*, EmployeesState*/ } from '../../common/types';
import createSelectors from '../selectors';

// type State = {
//   employees: Employee[];
// }

// type Action = {
//   addEmployee: (employee: Employee) => void;
//   addEmployees: (employees: Employee[]) => void;
//   removeEmployee: (id: string) => void;
//   resetEmployeesList: () => void;
// }

// const useEmployeeStoreBase = create<State & Action>((set) => ({
//   employees: [],
//   addEmployee: (employee: Employee) => set((state) => ({ employees: [...state.employees, employee] })),
//   addEmployees: (employees: Employee[]) => set((state) => ({ employees: [...state.employees, ...employees] })),
//   removeEmployee: (id: string) => set((state) => ({ employees: state.employees.filter((employee) => employee.id !== id) })),
//   resetEmployeesList: () => set({ employees: [] }),
// }))

interface EmployeesState {
  employees: Employee[];
  addEmployee: (employee: Employee) => void;
  addEmployees: (employees: Employee[]) => void;
  removeEmployee: (id: string) => void;
  resetEmployeesList: () => void;
}

const useEmployeeStore = create<EmployeesState>()(
  devtools(
    persist(
      (set) => ({
        employees: [],
        addEmployee: (employee: Employee) => set((state) => ({ employees: [...state.employees, employee] })),
        addEmployees: (employees: Employee[]) => set((state) => ({ employees: [...state.employees, ...employees] })),
        removeEmployee: (id: string) => set((state) => ({ employees: state.employees.filter((employee) => employee.id !== id) })),
        resetEmployeesList: () => set({ employees: [] }),
      }),
      {
        name: 'employees-storage',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
)

// const useEmployeeStoreBase = create<EmployeesState>()(
//   devtools(
//     persist(
//       (set) => ({
//         employees: [],
//         addEmployee: (employee: Employee) => set((state) => ({ employees: [...state.employees, employee] })),
//         removeEmployee: (id: string) => set((state) => ({ employees: state.employees.filter((employee) => employee.id !== id) })),
//         resetEmployeesList: () => set({ employees: [] }),
//       }),
//       {
//         name: 'employees-storage',
//         storage: createJSONStorage(() => localStorage),
//       }
//     )
//   )
// );


export default createSelectors(useEmployeeStore);