import React, { useState, ReactNode, useRef, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import UpdateEmployee from '../UpdateEmployee';

import CreateEmployee from '../../components/CreateEmployee';
import  { Table, type Column, type TableProps } from 'react-table-library'
import type { Employee } from '../../common/types';
import useEmployeeStore from '../../app/hooks/store';
import logo from '../../assets/WealthHealth_Logo.png';
// import { act } from 'react-dom/test-utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Home(): JSX.Element {
  const [hoveredRow, setHoveredRow] = useState<Employee | null>(null);

  const navigate = useNavigate();

  let { columns, rows}: TableProps<Employee> = {
    columns: [] as Column<Employee>[],
    rows: [] as Employee[],
    onRowHover: () => {}
  }

  const [activeEmployeeAddForm, setActiveEmployeeAddForm] = useState<boolean>(false);
  const employees = useEmployeeStore.use.employees();

  function dateRenderer(dateString: string):ReactNode {
    const date = new Date(dateString);
    
    return (
      <span>{date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/{(date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}/{date.getFullYear()}</span>
    )
  }

  function handleUpdateEmployee(employeeId: string) {
    navigate(`/update-employee/${employeeId}`);
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
          <button type="button" className="bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
          </>
        )}
        </div>
      </div>
    )
  }
  
  columns = [
    {
      property: 'firstName',
      displayName: 'First Name',
      filter: 'default',
      type: 'string'
    },
    {
      property: 'lastName',
      displayName: 'Last Name',
      filter: 'default',
      type: 'string',
    },
    {
      property: 'dateOfBirth',
      displayName: 'Date of Birth',
      filter: 'default',
      type: 'date',
      renderer: (value: string) => dateRenderer(value)
    },
    {
      property: 'startDate',
      displayName: 'Start Date',
      filter: 'default',
      type: 'date',
      renderer: (value: string) => dateRenderer(value)
    },
    {
      property: 'street',
      displayName: 'Street',
      filter: 'default',
      type: 'string',
    },
    {
      property: 'city',
      displayName: 'City',
      filter: 'default',
      type: 'string'
    },
    {
      property: 'state',
      displayName: 'State',
      filter: 'default',
      type: 'string'
    },
    {
      property: 'zipCode',
      displayName: 'Zip Code',
      filter: 'default',
      type: 'number'
    },
    {
      property: 'department',
      displayName: 'Department',
      filter: 'default',
      type: 'string'
    },
    {
      property: 'id',
      displayName: '',
      filter: 'default',
      type: 'string',
      renderer: (id: string) => editAndDeleteEmployeeButtons(id),
      className: 'hidden w-[1px] p-0'
    }
  ]

  rows = employees;
  
  return (
    <div className='container mx-auto'>
      <h1 className='text-center text-emerald-700 text-3xl py-[25px]'><img src={logo} alt="logo" className='h-auto inline-block'/><span className='text-white bg-[#105924] inline-block p-[10px] border-2 border-[#105924]'>HRnet</span><span className='text-[#105924] inline-block p-[10px] border-2 border-[#105924]'>Dashboard</span></h1>
      {!activeEmployeeAddForm && (
      <div className='flex justify-end'>
        <button type='button' className='bg-emerald-700 text-white py-2 px-4 rounded' onClick={() => setActiveEmployeeAddForm(true)}>Add Employee</button>
      </div>
      )}
      
      {activeEmployeeAddForm && (
        <CreateEmployee activeEmployeeAddForm={activeEmployeeAddForm} setActiveEmployeeAddForm={ setActiveEmployeeAddForm }/>
      )}
      
      <Table
        columns={columns}
        rows={rows}
        onRowHover={(row: Employee | null) => setHoveredRow(row)}
        columnsClassName='bg-emerald-700 text-white'
        rowsClassName='odd:bg-emerald-500/20 even:bg-gray-100'
        cellClassName='last:border-r-0 last:bg-white'
      />
        
    </div>
  )
}

export default Home;