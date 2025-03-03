import { DatePicker } from "antd";
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmployeeStore from '../../app/hooks/store';
import { Employee, USStates } from '../../common/types';
import type { Dayjs } from 'dayjs';

function CreateEmployee (): JSX.Element {
  const addEmployee = useEmployeeStore(state => state.addEmployee);
  const navigate = useNavigate();

  const defaultState = Object.values(USStates)[0];

  const [formData, setFormData] = useState<Employee>({
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    startDate: dayjs(Date.now()).format('YYYY-MM-DD'),
    street: '',
    city: '',
    state: defaultState,
    zipCode: '00000',
    department: ''
  });
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [emptyFields, setEmptyFields] = useState<Array<keyof Employee>>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement > | Dayjs | string | null, dateId?: keyof Employee) => {
    setSubmitting(false)
    let targetId: keyof Employee;
    let targetValue: string | number | null;

    if (dateId) {
      targetId = dateId;
      targetValue = (e as Dayjs)?.format('YYYY-MM-DD') || '';
    } else {
      targetId = (e as React.ChangeEvent<HTMLInputElement>).target.id as keyof Employee;
      // if (targetId === 'zipCode') {
      //   targetValue = parseInt((e as React.ChangeEvent<HTMLInputElement>).target.value.trim());
      // } else {
      targetValue = (e as React.ChangeEvent<HTMLInputElement>).target.value;
    }

    console.log(targetId, targetValue)

    setFormData(prev => ({...prev, [targetId]: targetValue}))

    if (emptyFields.includes(targetId)) {
      setEmptyFields(prev => prev.filter(field => field !== targetId))
    }
  }

  const validateFormData = (): boolean => {
    return formData.firstName.length > 0
      && formData.lastName.length > 0
      && formData.dateOfBirth.length > 0
      && formData.startDate.length > 0
      && formData.street.length > 0
      && formData.city.length > 0
      && formData.state.length > 0
      && formData.zipCode !== null
      && formData.department.length > 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    for (const key in formData) {
      if (key !== 'id' && key !== 'zipCode' && formData[key as keyof Employee] === '') {
        setEmptyFields(prev => {
          if (!prev.includes(key as keyof Employee)) {
            return [
              ...prev,
              key as keyof Employee
            ]
          } else {
            return prev
          }
        })
        console.log(emptyFields)
        setSubmitting(false)
      }
    }

    if (validateFormData()) {
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
      navigate('/');
    }

    setSubmitting(false);
  }

  useEffect(() => {
    console.log(emptyFields)
  }, [emptyFields])

  useEffect(() => {
    console.log('date of birth', formData.dateOfBirth)
    console.log('start date', formData.startDate)
  }, [formData.dateOfBirth, formData.startDate])

  return (
    // <LocalizationProvider dateAdapter={AdapterDayjs}>
    <>
    <h2 className='text-center text-[#105924] font-bold text-4xl py-[25px]'>Create an Employee</h2>
      <div className='flex flex-col items-center justify-center'>
        <form 
          onSubmit={(e) => {
            handleSubmit(e)
          }}
        >
          <div className='my-2 w-auto'>
            <div className={`text-red-600 ${(!submitting && emptyFields.includes('firstName')) ? '' : 'hidden'}`}>
              The <span className='font-bold'>First name</span> field is required !
            </div>

            <label htmlFor="first-name" className='block font-bold'>First Name</label>

            <input
              type="text"
              id="firstName"
              placeholder="John"
              onChange={handleChange}
              className='block border-2 border-zinc-600 rounded-[5px] pl-[5px]'
            />
          </div>
          
          <div className='my-1.5'>
            <div className={`text-red-600 ${(!submitting && emptyFields.includes('lastName'))  ? '' : 'hidden'}`}>
              The <span className='font-bold'>Last name</span> field is required !
            </div>
            <label htmlFor="last-name" className='block font-bold'>Last Name</label>
            <input
              type="text"
              id="lastName"
              placeholder="Doe"
              onChange={handleChange}
              className='block border-2  border-zinc-600 rounded-[5px] pl-[5px]'
            />
          </div>

          <div className='my-1.5'>
            <div className={`text-red-600 ${!submitting && emptyFields.includes('dateOfBirth') ? 'block' : 'hidden'}`}>
              The <span className='font-bold'>Date of birth</span> field is required !
            </div>
            <label htmlFor="date-of-birth" className='block font-bold'>Date of Birth</label>
            <DatePicker
              name='date-of-birth'
              inputReadOnly= {true}
              onChange={e => handleChange(e, 'dateOfBirth')}
              maxDate={dayjs().subtract(18, 'year')}
              style={{border: '2px solid #52525c', borderRadius: '5px', padding: '5px'}}
            />
          </div>

          <div className='my-1.5'>
            <div className={`text-red-600 ${!submitting && emptyFields.includes('startDate') ? 'block' : 'hidden'}`}>
              The <span className='font-bold'>Date of beginning</span> field is required !
            </div>

            <label htmlFor="start-date" className='block font-bold'>Date of beginning</label>
            <DatePicker
              id="startDate"
              name='start-date'
              inputReadOnly= {true}
              defaultValue={dayjs()}
              onChange={e => handleChange(e, 'startDate')}
              maxDate={dayjs()}
              style={{border: '2px solid #52525c', borderRadius: '5px', padding: '5px'}}
            />
          </div>
          
          <fieldset className="border-2 border-zinc-600 rounded-[5px] pb-[10px]">
            <legend className="ml-[10px] p-[5px] font-bold">Address</legend>

            <div className='ml-[10px] my-1.5'>
              <div className={`text-red-600 ${!submitting && emptyFields.includes('street') ? 'block' : 'hidden'}`}>
                The <span className='font-bold'>Street</span> field is required !
              </div>

              <label htmlFor="street" className='block font-bold'>Street</label>
              <input
                id="street"
                type="text"
                onChange={handleChange}
                className='block border-2 border-zinc-600 rounded-[5px] pl-[5px]'
              />
            </div>

            <div className='ml-[10px] my-1.5'>
              <div className={`text-red-600 ${!submitting && emptyFields.includes('city') ? 'block' : 'hidden'}`}>
                The <span className='font-bold'>City</span> field is required !
              </div>

              <label htmlFor="city" className='block font-bold'>City</label>
              <input
                id="city"
                type="text"
                onChange={handleChange}
                className='block border-2 border-zinc-600 rounded-[5px] pl-[5px]'
              />
            </div>

            <div className='ml-[10px] my-1.5 mr-[10px]'>
              <div className={`text-red-600 ${!submitting && emptyFields.includes('state') ? '' : 'hidden'}`}>
                The <span className='font-bold'>State</span> field is required !
              </div>
              <label htmlFor="state" className='block font-bold'>State</label>
              <select
                id="state"
                // defaultValue={String(document.querySelector('option')?.getAttribute('value'))}
                value={formData.state}
                onChange={handleChange}
                className='block border-2 border-zinc-600 rounded-[5px] pl-[5px]'
              >
              {Object.values(USStates).map((state: string, index: number) => (
                <option key={index} value={state}>{state}</option>
              ))}
              </select>
            </div>

            <div className='ml-[10px] my-1.5'>
              <label htmlFor="zipCode" className='block font-bold'>Zip Code</label>
              <input
                id="zipCode"
                type="number"
                min="0"
                defaultValue={'00000'}
                onChange={handleChange}
                className='block border-2 border-zinc-600 rounded-[5px] pl-[5px]'
              />
            </div>
          </fieldset>

          <div className='my-1.5'>
            <div key={emptyFields.indexOf('department')} className={`text-red-600 ${!submitting && emptyFields.includes('department') ? 'block' : 'hidden'}`}>
              The <span className='font-bold'>Department</span> field is required !
            </div>

            <label htmlFor="department" className='block font-bold'>Department</label>
            <select
              id="department"
              // value={formData.department}
              onChange={handleChange}
              className='block border-2 border-zinc-600 rounded-[5px] pl-[5px]'
            >
              <option value="">Select a department</option>
              <option value="Sales">Sales</option>
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Legal">Legal</option>
            </select>
          </div>

          <div className='flex mt-[20px] mb-[20px] gap-1.5 justify-center'>
            <button
              type='submit'
              className='bg-[#105924] hover:bg-[#105924]/80 text-white rounded-[8px] px-[10px] py-[5px]'
            >
              Save
            </button>
            
            <button
              type='reset'
              className='bg-[#105924] hover:bg-[#105924]/80 text-white rounded-[8px] p-1.5'
              onClick={() => navigate('/')}
            >
              Cancel
            </button>
          </div>
        </form>

      </div>
      </>
    // </LocalizationProvider>
  )
}

export default CreateEmployee;