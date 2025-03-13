import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Column, TableProps } from 'react-ts-tab-lib';
import { Table } from 'react-ts-tab-lib';
import useEmployeeStore from '../../app/hooks/store';
import type { Employee } from '../../common/types';

/**
 * This is the homepage component of the application.
 * It displays all the employees in the store in a table.
 * The table is a custom component made using 'react-ts-tab-lib'.
 * The component has a fixed header with the column names.
 * The component has a sample length option dropdown.
 * The component has a search bar.
 * The component has a sort button.
 * The component has a pagination system.
 * The component has a style for the odd and even rows.
 * The component has a style for the current page button.
 * The component has a style for the pages buttons.
 * The component has a style for the navigation buttons.
 * The component has a style for the cells.
 * The component has a default order for the table.
 * The component is responsive and adapts to different screen sizes.
 * The component is fixed at the top of the page.
 * The component has a button to navigate to the create employee page.
 */
function Home(): JSX.Element {
  const [rows, setRows] = useState<Employee[]>([]);
  const navigate = useNavigate();
  const employees = useEmployeeStore(state => state.employees);
  const [currentDisplayedEmployeeId, setCurrentDisplayedEmployeeId] = useState<string | null>(null);

  useEffect(() => {
    setRows(employees);
     
  }, [employees]);

  useEffect(() => {
    if (currentDisplayedEmployeeId === null) return;
    navigate(`/profile/${currentDisplayedEmployeeId}`);
  }, [currentDisplayedEmployeeId, navigate]);

  /**
   * Formats a date string into a human-readable date format.
   * The formatted date is in the format `DD/MM/YYYY`.
   * If the day or month is a single digit, it is prefixed with a zero.
   * 
   * @param dateString - A string representing a date.
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
  
  const tableProps: TableProps<Employee> = {
    columns,
    rows,
    /**
     * Function to be called when a row in the table is clicked.
     * Sets the employeeId state to the id of the clicked row.
     * @param row - The row that was clicked. If null, the function does nothing.
     */
    onRowClick: (row: Employee | null) => {
      if (!row) return;
      setCurrentDisplayedEmployeeId(row?.id);
    },
    classNames: {
      tableBorders: 'border-2 border-gray-300',
      tablePaddings: 'p-[5px]',
      tableHeaders: {
        borders: 'border-t-2 border-b-2 border-gray-300',
        borderLeft: 'border-l-2',
        borderRight: 'border-r-2',
        roundedLeft: 'rounded-tl-[25px] rounded-bl-[25px]',
        roundedRight: 'rounded-tr-[25px] rounded-br-[25px]',
        backgroundColor: 'bg-gray-800 hover:bg-gray-600 hover:shadow-[0_0_7px_0px_#7f7fbe]',
        padding: 'py-[5px]',
      },
      samplingOptions: {
        buttonBackgroundColor: 'bg-gray-800 hover:bg-gray-600 hover:shadow-[0_0_7px_1px_#7f7fbe]',
        buttonBorders: 'border-2 border-gray-300',
        buttonPadding: 'px-[20px]',
      },
      searchBar: {
        label: "sr-only",
        input: "py-[5px] px-[10px] border-2 border-gray-300 hover:border-gray-400 rounded-[20px] focus:outline-none"
      },
      rows: {
        oddRowBackgroundColor: 'bg-gray-500 hover:bg-gray-600',
        evenRowBackgroundColor: 'bg-gray-300 hover:bg-gray-700'
      }
    },
    textContent: {
      searchPlaceholder: "Search..."
    },
    defaultOrder: {
      property: 'lastName',
      order: 'asc'
    },
  };

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
          key={rows.length}
          {...tableProps}
        />
      </div>
    </main>
  )
}

export default Home;