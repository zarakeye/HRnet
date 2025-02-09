import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Employee, USStates } from '../../common/types';
import useEmployeeStore from '../../app/hooks/store';

// interface UpdateEmployeeProps {
//   id: string;
// }

function UpdateEmployee (/*{id}: UpdateEmployeeProps*/): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const employees = useEmployeeStore.use.employees();
  const row = employees.find((employee) => employee.id === id);
  const updateEmployee = useEmployeeStore.use.updateEmployee();
  const deleteEmployee = useEmployeeStore.use.removeEmployee();
  const [displayDeleteInput, setDisplayDeleteInput] = useState<boolean>(false);

  const [formData, setFormData] = useState<Employee>({
    id: row?.id || '',
    firstName: row?.firstName || '',
    lastName: row?.lastName || '',
    dateOfBirth: row?.dateOfBirth || '',
    startDate: row?.startDate || '',
    street: row?.street || '',
    city: row?.city || '',
    state: row?.state || '',
    zipCode: row?.zipCode || 0,
    department: row?.department || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({...prev, [e.target.id]: e.target.value}))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formData.firstName && formData.lastName && formData.dateOfBirth && formData.startDate && formData.street && formData.city && formData.state && formData.zipCode && !isNaN(formData.zipCode) && formData.department && formData.department !== '') {
      const newEmployee: Employee = {
        id: row?.id || '',
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        startDate: formData.startDate,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        department: formData.department
      };

      updateEmployee(newEmployee);
    } else {
      alert('Please fill in all fields');
    }
  }

  function formatDate(dateString: string) {
    if (!dateString) {
      return '';
    }

    const date = new Date(dateString);

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }


  return (
    <div className='flex flex-col items-center justify-center'>
      <p>id : {row?.id}</p>
      <form 
        onSubmit={(e) => {
          handleSubmit(e)
        }}
      >
        <div className='my-2 w-auto'>
          <label htmlFor="first-name" className='block'>First Name</label>
          <input
            type="text"
            id="first-name"
            placeholder="John"
            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
            required
            className='block border-2 border-zinc-500 rounded-[5px] pl-[5px]'
            defaultValue={row?.firstName}
          />
        </div>
        
        <div className='my-1.5'>
          <label htmlFor="last-name" className='block'>Last Name</label>
          <input
            type="text"
            id="last-name"
            placeholder="Doe"
            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
            required
            className='block border-2 border-gray rounded-[5px] pl-[5px]'
            defaultValue={row?.lastName}
          />
        </div>

        <div className='my-1.5'>
          <label htmlFor="date-of-birth" className='block'>Date of Birth</label>
          <input
            id="date-of-birth"
            type="date"
            placeholder='mm/dd/yyyy'
            onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
            required
            className='block border-2 border-gray rounded-[5px] pl-[5px]'
            defaultValue={row?.dateOfBirth}
          />
        </div>

        <div className='my-1.5'>
          <label htmlFor="start-date" className='block'>Start Date</label>
          <input
            id="start-date"
            type="date"
            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
            required
            className='block border-2 border-gray rounded-[5px] pl-[5px]'
            defaultValue={row?.startDate}
          />
        </div>

        <fieldset className="border-2 border-gray rounded-[5px] pb-[10px]">
          <legend className="ml-[10px] p-[5px]">Address</legend>

          <div className='ml-[10px] my-1.5'>
            <label htmlFor="street" className='block'>Street</label>
            <input
              id="street"
              type="text"
              onChange={handleChange}
              className='block border-2 border-gray rounded-[5px] pl-[5px]'
              defaultValue={row?.street}
            />
          </div>

          <div className='ml-[10px] my-1.5'>
            <label htmlFor="city" className='block'>City</label>
            <input
              id="city"
              type="text"
              onChange={handleChange}
              className='block border-2 border-gray rounded-[5px] pl-[5px]'
              defaultValue={row?.city}
            />
          </div>

          <div className='ml-[10px] my-1.5 mr-[10px]'>
            <label htmlFor="state" className='block'>State</label>
            <select
              id="state"
              onChange={handleChange}
              className='block border-2 border-gray rounded-[5px] pl-[5px]'
              defaultValue={row?.state}
            >
            {Object.values(USStates).map((state: string, index: number) => (
              <option key={index} value={state}>{state}</option>
            ))}
            </select>
          </div>

          <div className='ml-[10px] my-1.5'>
            <label htmlFor="zip-code" className='block'>Zip Code</label>
            <input
              id="zip-code"
              type="number"
              onChange={(e) => {
                const value = isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                setFormData(prev => ({...prev, zipCode: value}))
              }}
              className='block border-2 border-gray rounded-[5px] pl-[5px]'
              defaultValue={row?.zipCode}
            />
          </div>
        </fieldset>

        <div className='my-1.5'>
          <label htmlFor="department" className='block'>Department</label>
          <select
            id="department"
            onChange={e => setFormData({ ...formData, department: e.target.value })}
            className='block border-2 border-gray rounded-[5px] pl-[5px]'
            required
            defaultValue={row?.department}
          >
            <option disabled value="">Select a department</option>
            <option value="Sales">Sales</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Legal">Legal</option>
          </select>
        </div>

        <div className='flex mt-[20px] mb-[20px] gap-1.5 justify-center'>
          <button
            type='submit'
            className='bg-emerald-700 text-white rounded-[8px] px-[10px] py-[5px]'
          >
            Update
          </button>
          
          <button
            type='reset'
            className='bg-emerald-700 text-white rounded-[8px] p-1.5'
            onClick={() => navigate(`/`)}
          >
            Cancel
          </button>
        </div>
      </form>

      <button
        type='button'
        onClick={() => setDisplayDeleteInput(true)}
        className='bg-red-700 text-white rounded-[8px] px-[10px] py-[5px]'
      >
        Delete Employee
      </button>

      {displayDeleteInput && (
        <div className='flex flex-col items-center justify-center'>
          <p>{`To delete this employee, type "DELETE {employee id}" below:`}</p>
          <input
            type="text"
            onChange={(e) => {
              if (e.target.value === `DELETE ${row?.id}`) {
                deleteEmployee(row?.id || '');
              }
            }}
            className='block border-2 border-gray rounded-[5px] pl-[5px]'
          />
        </div>
      )}
    </div>
  )
}

export default UpdateEmployee