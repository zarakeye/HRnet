import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Column } from 'react-ts-tab-lib';
import { Table } from 'react-ts-tab-lib';
import useEmployeeStore from '../../app/hooks/store';
import type { Employee } from '../../common/types';

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

  /**
   * Converts a date string into a formatted JSX span element.
   * The date is formatted as 'DD/MM/YYYY', where days and months are zero-padded if necessary.
   * @param dateString A string representation of a date.
   * @returns A ReactNode containing the formatted date.
   */
  function dateRenderer(dateString: string):ReactNode {
    const date = new Date(dateString);
    
    return (
      <span>{date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/{(date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}/{date.getFullYear()}</span>
    )
  }
  
  const columns: Column<Employee>[] = [
    {
      property: 'firstName',
      displayName: 'First Name',
      type: 'string'
    },
    {
      property: 'lastName',
      displayName: 'Last Name',
      type: 'string',
      renderer: (value: string | number | null) => value && String(value).toUpperCase()
    },
    {
      property: 'dateOfBirth',
      displayName: 'Birth date',
      type: 'date',
      renderer: (value: string | number | null) => value && dateRenderer(String(value))
    },
    {
      property: 'startDate',
      displayName: 'Start date',
      type: 'date',
      renderer: (value: string | number | null) =>  value && dateRenderer(String(value))
    },
    {
      property: 'street',
      displayName: 'Street',
      type: 'string',
    },
    {
      property: 'city',
      displayName: 'City',
      type: 'string'
    },
    {
      property: 'state',
      displayName: 'State',
      type: 'string'
    },
    {
      property: 'zipCode',
      displayName: 'Zip Code',
      type: 'number'
    },
    {
      property: 'department',
      displayName: 'Department',
      type: 'string'
    }
  ];

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
        <Table
          columns={columns}
          rows={employees}
          onRowClick={
            (row: Employee | null) => {
              if (!row) return;
              navigate(`/profile/${row?.id}`);
          }}
          defaultOrder={{
            property: 'lastName',
            order: 'asc'
          }}
          textContent={{
            searchPlaceholder: "Search..."
          }}
          classNames={{
            tableBorders: 'border-2 border-gray-300',
            tablePaddings: 'pt-[5px] pb-[15px] px-[5px]',
            tableHeaders: {
              borderY: 'border-y-2',
              borderColor: 'border-gray-300',
              borderL: 'border-l-2',
              borderR: 'border-r-2',
              roundedL: 'rounded-tl-[25px] rounded-bl-[25px]',
              roundedR: 'rounded-tr-[25px] rounded-br-[25px]',
              backgroundColor: 'bg-gray-800 hover:bg-gray-600 hover:shadow-[0_0_7px_0px_#7f7fbe]',
              padding: 'py-[5px]',
              margin: 'mb-[10px]',
            },
            samplingOptions: {
              buttonBackgroundColor: 'bg-gray-800 hover:bg-gray-600 hover:shadow-[0_0_7px_1px_#7f7fbe]',
              buttonBorder: 'border-2',
              buttonBorderColor: 'border-gray-300',
              buttonPadding: 'px-[20px]',
            },
            searchBar: {
              label: "sr-only",
              inputBorder: " border-2",
              inputBorderColor: "border-gray-300 hover:border-gray-400",
              inputFocusOutLine: "focus:outline-none",
              inputPadding: "py-[5px] px-[10px]",
              inputBackgroundColor: "bg-gray-300 hover:shadow-[0_0_7px_1px_#7f7fbe]",
              inputRounded: "rounded-[20px]",
      
            },
            rows: {
              oddRowBackgroundColor: 'bg-gray-500 hover:bg-gray-600',
              evenRowBackgroundColor: 'bg-gray-300 hover:bg-gray-700',
              paddingX: 'px-[15px]',
              paddingT: 'pt-0',
            }
          }}
        />
      </div>
    </main>
  )
}

export default Home;