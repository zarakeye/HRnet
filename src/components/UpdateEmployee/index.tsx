import { DatePicker } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import useEmployeeStore from '../../app/hooks/store';
import { Employee, USStates } from '../../common/types';
import sanitize from '../../tools/sanitize';
import validateEmployeeFormData from '../../tools/validateEmployeeFormData';

interface UpdateEmployeeProps {
  id: string;
  setUpdating: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * A form to update an existing employee in the store.
 * The form is controlled and has validation.
 * The form is divided into sections for the employee's personal information, address and department.
 * The form has a submit and a cancel button.
 * The submit button is disabled if the form is not valid.
 * The cancel button closes the update modal.
 */
function UpdateEmployee({ id, setUpdating }: UpdateEmployeeProps): JSX.Element {
  const employees = useEmployeeStore(state => state.employees);
  const employeeToUpdate = employees.find((employeeToUpdate) => employeeToUpdate.id === id);
  const updateEmployee = useEmployeeStore(state => state.updateEmployee);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [emptyFields, setEmptyFields] = useState<Array<keyof Employee>>([]);

  const [formData, setFormData] = useState<Employee>({
    id: employeeToUpdate?.id || '',
    firstName: employeeToUpdate?.firstName || '',
    lastName: employeeToUpdate?.lastName || '',
    dateOfBirth: employeeToUpdate?.dateOfBirth || '',
    startDate: employeeToUpdate?.startDate || '',
    street: employeeToUpdate?.street || '',
    city: employeeToUpdate?.city || '',
    state: employeeToUpdate?.state || '',
    zipCode: employeeToUpdate?.zipCode || '',
    department: employeeToUpdate?.department || ''
  });

  /**
   * Updates the formData state with the value from the input element.
   * If the input element is a date picker, the value is formatted as 'DD/MM/YYYY'.
   * Checks if the input element corresponds to an empty field and removes it from the emptyFields array if it is not empty.
   * @param e The input element's change event, a Dayjs object, a string, or null.
   * @param dateId Optional key of the formData state to update when using a date picker.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | Dayjs | string | null, dateId?: keyof Employee) => {
    setSubmitting(false)
    let targetId: keyof Employee;
    let targetValue: string | number | null;

    if (dateId) {
      targetId = dateId;
      targetValue = (e as Dayjs)?.format('DD/MM/YYYY') || '';
    } else {
      targetId = (e as React.ChangeEvent<HTMLInputElement>).target.id as keyof Employee;
      targetValue = (e as React.ChangeEvent<HTMLInputElement>).target.value;
    }

    setFormData(prev => ({ ...prev, [targetId]: targetValue }))

    if (emptyFields.includes(targetId) && targetValue) {
      setEmptyFields(prev => prev.filter(field => field !== targetId))
    }
  }

  /**
   * Updates the emptyFields state when an input element has a value.
   * If the input element's id is in the emptyFields array and the value is not empty, the id is removed from the array.
   * @param e The input element's change event or a string or null.
   */
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string | null) => {
    const targetId: keyof Employee = (e as React.ChangeEvent<HTMLInputElement>).target.id as keyof Employee;

    if (emptyFields.includes(targetId)) {
      setEmptyFields(prev => prev.filter(field => field !== targetId))
    }
  }

  /**
   * Submits the form and updates the employee in the store.
   * Validates the updated employee data and sanitizes it.
   * If the updated employee data is valid, updates the employee in the store and closes the update modal.
   * @param e The form's submit event.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedEmployee: Employee = {
      id: employeeToUpdate?.id || '',
      firstName: sanitize(formData.firstName.trim()),
      lastName: sanitize(formData.lastName.trim()),
      dateOfBirth: sanitize(formData.dateOfBirth.trim()),
      startDate: sanitize(formData.startDate.trim()),
      street: sanitize(formData.street.trim()),
      city: sanitize(formData.city.trim()),
      state: sanitize(formData.state.trim()),
      zipCode: sanitize(formData.zipCode.trim()),
      department: sanitize(formData.department.trim())
    };

    if (validateEmployeeFormData(updatedEmployee)) {
      updateEmployee(updatedEmployee);
      setUpdating(false);
    }
  }

  return (
    <div className='flex flex-col px-[70px] justify-center bg-gray-300 rounded-b-[80px] border-b-2 border-x-2 border-gray-900'>
      <form
        onSubmit={(e) => {
          handleSubmit(e)
        }}
      >
        <div className='mb-[25px] h-[80px]'>
          <div className='h-[15px]'>
            <div key={emptyFields.indexOf('firstName')} className={`text-red-600 text-[10px] ${(!submitting && emptyFields.includes('firstName')) ? '' : 'hidden'}`}>
              The <span className='font-bold'>First name</span> field is required !
            </div>
          </div>

          <label htmlFor="first-name" className='block text-[#105924] font-bold py-[5px]'>First Name</label>
          <input
            type="text"
            id="firstName"
            placeholder="John"
            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
            onBlur={e => {
              if (!e.target.value) {
                setEmptyFields(prev => [...prev, 'firstName'])
              }
            }}
            onInput={(e) => handleInput(e as React.ChangeEvent<HTMLInputElement>)}
            className='block border-2 border-gray-900 bg-white rounded-[20px] pl-[10px] h-[36px]'
            defaultValue={employeeToUpdate?.firstName}
          />
        </div>

        <div className='mb-[25px] h-[80px]'>
          <div className='h-[15px]'>
            <div className={`text-red-600 text-[10px] ${(!submitting && emptyFields.includes('lastName')) ? '' : 'hidden'}`}>
              The <span className='font-bold'>Last name</span> field is required !
            </div>
          </div>

          <label htmlFor="last-name" className='block text-[#105924] font-bold pb-[5px]'>Last Name</label>
          <input
            type="text"
            id="lastName"
            placeholder="Doe"
            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
            onBlur={e => {
              if (!e.target.value) {
                setEmptyFields(prev => [...prev, 'lastName'])
              }
            }}
            onInput={(e) => handleInput(e as React.ChangeEvent<HTMLInputElement>)}
            className='block border-2 border-gray-900 bg-white rounded-[20px] pl-[10px] h-[36px]'
            defaultValue={employeeToUpdate?.lastName.toUpperCase()}
          />
        </div>

        <div className='mb-[25px] h-[80px]'>
          <div className='h-[15px]'></div>
          <label htmlFor="date-of-birth" className='block text-[#105924] font-bold'>Date of Birth</label>
          <DatePicker
            name='dateOfBirth'
            inputReadOnly={true}
            defaultValue={dayjs(employeeToUpdate?.dateOfBirth)}
            format='MM/DD/YYYY'
            onChange={e => handleChange(e, 'dateOfBirth')}
            maxDate={dayjs().subtract(18, 'year')}
            style={{ border: '2px solid #101828', borderRadius: '20px', paddingBottom: '10px', height: '36px' }}
          />
        </div>

        <div className='mb-[25px] h-[80px]'>
        <div className='h-[15px]'></div>
          <label htmlFor="start-date" className='block text-[#105924] font-bold'>Start Date</label>
          <DatePicker
            id="startDate"
            name='start-date'
            inputReadOnly={true}
            defaultValue={dayjs(employeeToUpdate?.startDate)}
            format='MM/DD/YYYY'
            onChange={e => handleChange(e, 'startDate')}
            maxDate={dayjs()}
            style={{ border: '2px solid #101828', borderRadius: '20px', padding: '10px', height: '36px' }}
          />
        </div>

        <fieldset className="border-2 border-gray-900 rounded-[20px] pb-[25px] mb-[25px]">
          <legend className="ml-[15px] p-[5px] text-gray-900 font-bold">Address</legend>

          <div className='flex flex-col items-center'>
            <div className='w-[270px] h-[80px]'>
              <div className='h-[24px]'>
                <div className={`text-red-600 ${!submitting && emptyFields.includes('street') ? 'block' : 'hidden'}`}>
                  The <span className='font-bold'>Street</span> field is required !
                </div>
              </div>

              <label htmlFor="street" className='block text-[#105924] font-bold'>Street</label>
              <input
                id="street"
                type="text"
                onChange={handleChange}
                onBlur={e => {
                  if (!e.target.value) {
                    setEmptyFields(prev => [...prev, 'street'])
                  }
                }}
                onInput={(e) => handleInput(e as React.ChangeEvent<HTMLInputElement>)}
                className='w-full block border-2 border-gray-900 bg-white rounded-[20px] pl-[10px] h-[36px]'
                defaultValue={employeeToUpdate?.street}
              />
            </div>

            <div className='w-[270px] my-1.5 h-[80px]'>
              <div className='h-[24px]'>
                <div className={`text-red-600 ${!submitting && emptyFields.includes('city') ? 'block' : 'hidden'}`}>
                  The <span className='font-bold'>City</span> field is required !
                </div>
              </div>

              <label htmlFor="city" className='block text-[#105924] font-bold'>City</label>
              <input
                id="city"
                type="text"
                onChange={handleChange}
                onBlur={e => {
                  if (!e.target.value) {
                    setEmptyFields(prev => [...prev, 'city'])
                  }
                }}
                onInput={(e) => handleInput(e as React.ChangeEvent<HTMLInputElement>)}
                className='w-full block border-2 border-gray-900 bg-white rounded-[20px] pl-[10px] h-[36px]'
                defaultValue={employeeToUpdate?.city}
              />
            </div>

            <div className='w-[270px] my-1.5 mr-[10px] h-[80px]'>
              <div className='h-[24px]'>
                <div className={`text-red-600 ${!submitting && emptyFields.includes('state') ? '' : 'hidden'}`}>
                  The <span className='font-bold'>State</span> field is required !
                </div>
              </div>

              <label htmlFor="state" className='block text-[#105924] font-bold'>State</label>
              <select
                id="state"
                onChange={handleChange}
                onBlur={e => {
                  if (!e.target.value) {
                    setEmptyFields(prev => [...prev, 'state'])
                  }
                }}
                className='w-full block border-2 border-gray-900 bg-white rounded-[20px] pl-[10px] h-[36px]'
                defaultValue={employeeToUpdate?.state}
              >
                {Object.values(USStates).map((state: string, index: number) => (
                  <option key={index} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div className='w-[270px] my-1.5 h-[80px]'>
              <div className='h-[24px]'>
                <div className={`text-red-600 ${!submitting && emptyFields.includes('state') ? '' : 'hidden'}`}>
                  The <span className='font-bold'>Zip Code</span> field is required !
                </div>
              </div>

              <label htmlFor="zip-code" className='block text-[#105924] font-bold'>Zip Code</label>
              <input
                id="zipCode"
                type="number"
                onChange={(e) => {
                  const value = isNaN(parseInt(e.target.value)) ? 0 : e.target.value
                  setFormData(prev => ({ ...prev, zipCode: String(value) }))
                }}
                onBlur={e => {
                  if (!e.target.value) {
                    setEmptyFields(prev => [...prev, 'zipCode'])
                  }
                }}
                onInput={(e) => handleInput(e as React.ChangeEvent<HTMLInputElement>)}
                className='w-full block border-2 border-gray-900 bg-white rounded-[20px] pl-[10px] h-[36px]'
                defaultValue={String(employeeToUpdate?.zipCode)}
              />
            </div>
          </div>
        </fieldset>

        <div className='my-1.5 h-[80px]'>
          <label htmlFor="department" className='block text-[#105924] font-bold'>Department</label>
          <select
            id="department"
            onChange={e => setFormData({ ...formData, department: e.target.value })}
            onBlur={e => {
              if (!e.target.value) {
                setEmptyFields(prev => [...prev, 'department'])
              }
            }}
            className='block border-2 border-gray-900 bg-white rounded-[20px] px-[10px] h-[36px]'
            defaultValue={employeeToUpdate?.department}
          >
            <option disabled value="">Select a department</option>
            <option value="Sales">Sales</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Legal">Legal</option>
          </select>
        </div>

        <div className='flex mt-[50px] mb-[50px] gap-[15px] justify-center'>
          <button
            type='submit'
            className='bg-[#105924] hover:bg-[#105924]/80 hover:shadow-[0_0_7px_1px_#7f7fbe] text-white font-bold rounded-[20px] px-[15px] py-[8px]'
          >
            Update
          </button>

          <button
            type='reset'
            className='bg-[#105924] hover:bg-[#105924]/80 hover:shadow-[0_0_7px_1px_#7f7fbe] text-white font-bold rounded-[20px] px-[15px] py-[8px]'
            onClick={() => setUpdating(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateEmployee