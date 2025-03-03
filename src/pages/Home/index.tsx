import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Column, TableProps } from 'react-ts-tab-lib';
import { Table } from 'react-ts-tab-lib';
import useEmployeeStore from '../../app/hooks/store';
import type { Employee } from '../../common/types';

function Home(): JSX.Element {
  const [rows, setRows] = useState<Employee[]>([]);
  const employees = useEmployeeStore(state => state.employees);
  
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Updating rows : ', employees);
    setRows(employees);
     
  }, [employees]);

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
    onRowClick: (row: Employee | null) => navigate(`/profile/${row?.id}`),
    globalColumnsClassname: 'bg-[#105924]/90 hover:bg-[#105924]/60  text-white',
    sampleLengthSelectorClassname: 'border border-[#105924]/90 focus:outline-none rounded-[5px] mr-[10px] px-[10px] py-[5px]',
    searchInputClassname: 'border border-[#105924]/90 focus:outline-none rounded-[5px] ml-[10px] px-[10px] py-[5px]',
    sortButtonClassname: {
      style: 'scaleAndGlow',
      color: '#FFF'
    },
    rowsClassname: 'odd:bg-[#105924]/20 even:bg-gray-100 hover:odd:bg-[#105924]/40 hover:even:bg-gray-200 py-[10px]',
    currentPagePaginationButtonClassname: 'bg-pink-600 hover:bg-pink-600/80 text-white',
    pagesPaginationButtonsClassname: 'bg-emerald-600 hover:bg-emerald-600/80 text-white',
    paginationNavButtonsClassname: 'bg-[#105924] hover:bg-[#105924]/80 text-white py-2 px-4 rounded',
    cellClassname: 'first:border-l-0 last:border-r-0 py-[10px]',
    defaultOrder: {
      property: 'lastName',
      order: 'asc'
    },
  };

  return (
    <div className='container mx-auto'>
      <h2 className='text-center text-[#105924] font-bold text-4xl py-[25px]'>Current Employees</h2>
      
      <div className='w-full text-right'>
        <button
          type='button'
          className='bg-[#105924] hover:bg-[#105924]/80 text-white py-2 px-4 rounded'
          onClick={() => navigate('/create-employee')}
        >
          Add Employee
        </button>
      </div>

      <Table
        key={rows.length}
        {...tableProps}
      />     
    </div>
  )
}

export default Home;