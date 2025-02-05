import React, { useState } from 'react';
import { Employee, USStates } from '../../common/types';
// import GeographicAddress  from '../GeographicAddress';
import useEmployeeStore from '../../app/hooks/store';

interface CreateEmployeeProps {
  activeEmployeeAddForm: boolean;
  setActiveEmployeeAddForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateEmployee: React.FC<CreateEmployeeProps> = ({ setActiveEmployeeAddForm}: CreateEmployeeProps): JSX.Element => {
  // const employees = useEmployeeStore.use.employees();
  const addEmployee = useEmployeeStore.use.addEmployee();
  const [formData, setFormData] = useState<Employee>({
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    startDate: '',
    street: '',
    city: '',
    state: '',
    zipCode: 0,
    department: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData(prev => ({...prev, [e.target.id]: e.target.value}))
    }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newEmployee: Employee = {
      id: Date.now().toString(),
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

    addEmployee(newEmployee);
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
      <form 
        onSubmit={(e) => {
          handleSubmit(e)
          setActiveEmployeeAddForm(false)
        }}
      >
        <div className='my-2 w-auto'>
          <label htmlFor="first-name" className='block'>First Name</label>
          <input
            type="text"
            id="first-name"
            placeholder="John"
            value={formData.firstName as string}
            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
            required
            className='block border-2 border-zinc-500 rounded-[5px] pl-[5px]'
          />
        </div>
        
        <div className='my-1.5'>
          <label htmlFor="last-name" className='block'>Last Name</label>
          <input
            type="text"
            id="last-name"
            placeholder="Doe"
            value={formData.lastName as string}
            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
            required
            className='block border-2 border-gray rounded-[5px] pl-[5px]'
          />
        </div>

        <div className='my-1.5'>
          <label htmlFor="date-of-birth" className='block'>Date of Birth</label>
          <input
            id="date-of-birth"
            type="date"
            placeholder='mm/dd/yyyy'
            value={formatDate(formatDate(formData.dateOfBirth))}
            onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
            required
            className='block border-2 border-gray rounded-[5px] pl-[5px]'
          />
        </div>

        <div className='my-1.5'>
          <label htmlFor="start-date" className='block'>Start Date</label>
          <input
            id="start-date"
            type="date"
            value={formatDate(formatDate(formData.startDate))} 
            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
            required
            className='block border-2 border-gray rounded-[5px] pl-[5px]'
          />
        </div>

        <fieldset className="border-2 border-gray rounded-[5px] pb-[10px]">
          <legend className="ml-[10px] p-[5px]">Address</legend>

          <div className='ml-[10px] my-1.5'>
            <label htmlFor="street" className='block'>Street</label>
            <input
              id="street"
              type="text"
              value={formData.street}
              onChange={handleChange}
              className='block border-2 border-gray rounded-[5px] pl-[5px]'
            />
          </div>

          <div className='ml-[10px] my-1.5'>
            <label htmlFor="city" className='block'>City</label>
            <input
              id="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              className='block border-2 border-gray rounded-[5px] pl-[5px]'
            />
          </div>

          <div className='ml-[10px] my-1.5 mr-[10px]'>
            <label htmlFor="state" className='block'>State</label>
            <select
              id="state"
              value={formData.state}
              onChange={handleChange}
              className='block border-2 border-gray rounded-[5px] pl-[5px]'
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
              value={formData.zipCode}
              onChange={(e) => {
                const value = isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value)
                setFormData(prev => ({...prev, zipCode: value}))
              }}
              className='block border-2 border-gray rounded-[5px] pl-[5px]'
            />
          </div>
        </fieldset>

        <div className='my-1.5'>
          <label htmlFor="department" className='block'>Department</label>
          <select
            id="department"
            value={formData.department}
            onChange={e => setFormData({ ...formData, department: e.target.value })}
            className='block border-2 border-gray rounded-[5px] pl-[5px]'
            required
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
            Save
          </button>
          
          <button
            type='reset'
            className='bg-emerald-700 text-white rounded-[8px] p-1.5'
            onClick={() => setActiveEmployeeAddForm(false)}
          >
            Cancel
          </button>
        </div>
      </form>

    </div>
  )
}

export default CreateEmployee
        