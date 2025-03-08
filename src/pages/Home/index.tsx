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
      displayName: 'Date of Birth',
      type: 'date',
      renderer: (value: string | number | null) => value && dateRenderer(String(value))
    },
    {
      property: 'startDate',
      displayName: 'Start Date',
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
    componentGlobalClassname: 'px-[10px] sm:px-[20px] md:px-[50px] lg:px-[100px] xl:px-[150px] xxl:px-[200px]',
    globalColumnsClassname: 'bg-[#105924]/90 hover:bg-[#105924]/60 text-white whitespace-nowrap overflow-hidden text-ellipsis max-w-xs px-[10px] py-[5px]',
    sampleLengthOptionClassname: 'bg-[#105924]/20 hover:bg-[#105924]/40 text-[#105924]',
    sampleOptionsClassname: 'bg-[#105924]/20 hover:bg-[#105924]/40 text-[#105924]',
    customSelect: 'customSelect',
    searchLabelClassname: 'text-[#105924]',
    searchInputClassname: 'border border-[#105924]/90 focus:outline-none rounded-[5px] ml-[10px] px-[10px] py-[5px]',
    sortButtonClassname: {
      style: 'scaleAndGlow',
      color: '#FFF'
    },
    rowsClassname: 'odd:bg-[#105924]/20 even:bg-gray-100 hover:odd:bg-[#105924]/40 hover:even:bg-gray-200 py-[10px] cursor-pointer whitespace-nowrap',
    currentPagePaginationButtonClassname: 'bg-pink-600 hover:bg-pink-600/80 text-white',
    pagesPaginationButtonsClassname: 'bg-emerald-600 hover:bg-emerald-600/80 text-white',
    paginationNavButtonsClassname: 'bg-[#105924] hover:bg-[#105924]/80 text-white py-2 px-4 rounded',
    cellClassname: 'first:border-l-0 last:border-r-0 pl-[7px] pr-[20px] py-[10px]',
    defaultOrder: {
      property: 'lastName',
      order: 'asc'
    },
  };

  return (
    <main className='pt-[225px] mx-auto h-[699px] max-h-[700px]'>
      <div className='w-full bg-white text-center fixed left-[50%] translate-x-[-50%] top-[208px] p-[30px] z-5'>
        <h2 className='text-center text-[#105924] font-bold text-4xl py-[25px] '>Current Employees</h2>
      
        <button
          type='button'
          className='bg-[#105924] hover:bg-[#105924]/80 text-white font-bold rounded-[20px] px-[15px] py-[8px] overflow-x-auto whitespace-nowrap'
          onClick={() => navigate('/create-employee')}
        >
          Add Employee
        </button>
      </div>
      <div className='w-full mx-auto mt-[200px] overflow-x-auto'>
        <div className='w-full xs:px-[10px] sm:px-[10px] md:px-[100px] lg:px-[150px] xl:px-[200px] xxl:px-[250px] max-h-[500px] overflow-x-auto overflow-y-auto'>
          <Table
            key={rows.length}
            {...tableProps}
          />
        </div>
      </div>
    </main>
  )
}

export default Home;