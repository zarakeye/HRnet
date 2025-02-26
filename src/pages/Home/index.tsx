import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Table, type TableProps, type Column} from 'react-ts-tab-lib';
import useEmployeeStore from '../../app/hooks/store';
import logo from '../../assets/WealthHealth_Logo.png';
import type { Employee } from '../../common/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Home(): JSX.Element {
  const [hoveredRow, setHoveredRow] = useState<Employee | null>(null);
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

  function handleUpdateEmployee(employeeId: string) {
    navigate(`/update-employee/${employeeId}`);
  }

  function handleDeleteEmployee(employeeId: string) {
    navigate(`/delete-employee/${employeeId}`);
  }

  function editAndDeleteEmployeeButtons(id: string): ReactNode {
    return (
      <div
        className='edit-delete-buttons w-[150px] h-[50px] p-0'
      >
        <div className='buttons-container top-1/2 flex gap-2'>
        {hoveredRow?.id && (
          <>
          <button type="button" className="bg-emerald-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleUpdateEmployee(id)}>Edit</button>
          <button type="button" className="bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDeleteEmployee(id)}>Delete</button>
          </>
        )}
        </div>
      </div>
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
    },
    {
      property: 'id',
      displayName: '',
      type: 'string',
      renderer: (id: string | number | null) => id && editAndDeleteEmployeeButtons(String(id)),
      className: 'hidden w-[1px] p-0'
    }
  ];
  
  const tableProps: TableProps<Employee> = {
    columns,
    rows,
    onRowHover: (row: Employee | null) => setHoveredRow(row),
    columnsClassName: 'bg-emerald-700 hover:bg-emerald-600 text-white',
    sortButtonClassName: {
      style: 'scaleAndGlow',
      color: '#FFF'
    },
    rowsClassName: 'odd:bg-emerald-500/20 even:bg-gray-100 hover:odd:bg-emerald-500/40 hover:even:bg-gray-200 py-[10px]',
    cellClassName: 'first:border-l-0 last:border-r-0 last:bg-white py-[10px]',
    defaultOrder: {
      property: 'lastName',
      order: 'asc'
    },
  };


  return (
    <div className='container mx-auto'>
      <h1 className='text-emerald-700 text-3xl py-[25px]'><img src={logo} alt="logo" className='h-auto inline-block'/><span className='text-white bg-[#105924] inline-block p-[10px] border-2 border-[#105924]'>HRnet</span><span className='text-[#105924] inline-block p-[10px] border-2 border-[#105924]'>Dashboard</span></h1>
      <h2 className='text-center text-emerald-700 text-2xl py-[25px]'>Current Employees</h2>
      <div className='flex justify-end'>
        <button type='button' className='bg-emerald-700 hover:bg-emerald-600 text-white py-2 px-4 rounded' onClick={() => navigate('/create-employee')}>Add Employee</button>
      </div>
      <Table key={rows.length}{...tableProps} />     
    </div>
  )
}

export default Home;