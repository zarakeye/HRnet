import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmployeeStore from '../../app/hooks/store';
import EmployeeTable from '../../components/EmployeeTable';

/**
 * Component that renders a table of employees in the store.
 * The table includes columns for the employee's first name, last name, date of birth, start date, street, city, state, zip code, and department.
 * The table also includes a button to add a new employee.
 * The component uses the useEmployeeStore hook to get the employees from the store.
 * The component uses the navigate hook to navigate to the /create-employee page when the add button is clicked.
 * The component uses the Table component from react-ts-tab-lib to render the table.
 * The component uses a custom renderer for the date columns to format the date as 'DD/MM/YYYY'.
 * The component uses a custom renderer for the last name column to format the last name as all uppercase.
 * The component uses a custom renderer for the search bar to add a search icon.
 */
function Home(): JSX.Element {
  const navigate = useNavigate();
  const employees = useEmployeeStore(state => state.employees);
  const loading = useEmployeeStore(state => state.loading);
  const loadEmployees = useEmployeeStore(state => state.loadEmployees);


  useEffect(() => {
    // S'assurer que les employés sont chargés
    if (employees.length === 0 && !loading) {
      loadEmployees();
    }
  }, [employees.length, loading, loadEmployees]);

  return (
    <main className='pt-[225px] h-[699px] max-h-[700px] '>
      <div className='bg-white text-center fixed left-[50%] translate-x-[-50%] top-[200px] z-5'>
        <div className='px-[300px] py-[30px] bg-gray-900 rounded-[25px]'>
          <h2 className='text-center text-white font-bold text-4xl pb-[25px] whitespace-nowrap'>Current Employees</h2>
        
          <button
            type='button'
            className='bg-red-900 hover:bg-red-800 hover:shadow-[0_0_7px_3px_#9f0712] text-white font-bold rounded-[20px] px-[15px] py-[8px]  whitespace-nowrap'
            onClick={() => navigate('/create-employee')}
          >
            Add Employee
          </button>
        </div>
      </div>

      <div className='xs:px-[10px] sm:px-[10px] md:px-[100px] lg:px-[150px]  max-h-[500px] mt-[200px] overflow-y-auto'>
        <EmployeeTable employees={employees} />
      </div>
    </main>
  );
}

export default Home;