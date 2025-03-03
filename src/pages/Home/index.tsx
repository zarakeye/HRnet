import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Column, TableProps } from 'react-ts-tab-lib';
import { Table } from 'react-ts-tab-lib';
import useEmployeeStore from '../../app/hooks/store';
import type { Employee } from '../../common/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Home(): JSX.Element {
  // const [hoveredRow, setHoveredRow] = useState<Employee | null>(null);
  const [rows, setRows] = useState<Employee[]>([]);
  const employees = useEmployeeStore(state => state.employees);
  
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Updating rows : ', employees);
    setRows(employees);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees]);

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
    sampleLengthSelectorClassname: 'border border-[#105924]/90 hover:bg-[#105924]/60 rounded-[5px] mr-[10px] px-[10px] py-[5px]',
    searchInputClassname: 'border border-[#105924]/90 hover:bg-[#105924]/60 rounded-[5px] ml-[10px] px-[10px] py-[5px]',
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
      <div className='flex justify-end'>
        <button type='button' className='bg-[#105924] hover:bg-[#105924]/80 text-white py-2 px-4 rounded' onClick={() => navigate('/create-employee')}>Add Employee</button>
      </div>
      <Table key={rows.length} {...tableProps} />     
    </div>
  )
}

export default Home;