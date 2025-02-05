import React, { useState } from 'react';
import CreateEmployee from '../../components/CreateEmployee';
import  { Table, type Column, type TableProps } from 'react-table-library'
import type { Employee } from '../../common/types';
import useEmployeeStore from '../../app/hooks/store';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Home: React.FC = (): JSX.Element => {
  let { columns, rows }: TableProps<Employee> = {
    columns: [] as Column<Employee>[],
    rows: [] as Employee[]
  }

  const [activeEmployeeAddForm, setActiveEmployeeAddForm] = useState<boolean>(false);
  const employees = useEmployeeStore.use.employees();
  
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
      type: 'string'
    },
    {
      property: 'dateOfBirth',
      displayName: 'Date of Birth',
      filter: 'default',
      type: 'date'
    },
    {
      property: 'startDate',
      displayName: 'Start Date',
      filter: 'default',
      type: 'date'
    },
    {
      property: 'street',
      displayName: 'Street',
      filter: 'default',
      type: 'string'
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
  ]

  rows = employees;
  
  return (
    <div className='container mx-auto'>
      <h1 className='text-center text-emerald-700 text-3xl py-[25px]'>HRnet Dashboard</h1>
      {!activeEmployeeAddForm && (
      <div className='flex justify-end'>
        <button type='button' className='bg-emerald-700 text-white py-2 px-4 rounded' onClick={() => setActiveEmployeeAddForm(true)}>Add Employee</button>
      </div>
      )}
      
      {activeEmployeeAddForm && (
        <CreateEmployee activeEmployeeAddForm={activeEmployeeAddForm} setActiveEmployeeAddForm={ setActiveEmployeeAddForm }/>
      )
      }

      <Table columns={columns} rows={rows}/>
    </div>
  )
}

export default Home;