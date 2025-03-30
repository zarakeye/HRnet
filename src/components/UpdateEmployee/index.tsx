import { DatePicker, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import useEmployeeStore from '../../app/hooks/store';
import { Employee, USStates } from '../../common/types';
import {isSubmittableFormData, isNotOnlyDigits, isOnlyAlphanumeric, isOnlyLetters, isValidZipCode, sanitize, isZipCodeUnderConstruction} from '../../tools/validate';

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
  const [states, setStates] = useState<Array<{label: string, value: string}>>([]);
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
  const [fieldsErrors, setFieldsErrors] = useState<Employee>({
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    startDate: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    department: ''
  });
  // const [submitting, setSubmitting] = useState<boolean>(false);
  const [wrongValueType, setWrongValueType] = useState<Array<keyof Employee>>([]);
  const [zipCodeCandidate, setZipCodeCandidate] = useState<string>(employeeToUpdate?.zipCode as string);

  useEffect(() => {
    const statesArray = Object.values(USStates).map(state => ({
      label: state,
      value: state
    }));

    setStates(statesArray);
  }, [])

  /**
   * Updates the formData state with the value from the input element.
   * If the input element is a date picker, the value is formatted as 'DD/MM/YYYY'.
   * Checks if the input element corresponds to an empty field and removes it from the emptyFields array if it is not empty.
   * @param e The input element's change event, a Dayjs object, a string, or null.
   * @param dateId Optional key of the formData state to update when using a date picker.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | Dayjs | string | null, type?: string, dateId?: keyof Employee) => {
    let targetId: keyof Employee;
    let targetValue: string | number | null;

    if (dateId) {
      targetId = dateId;
      targetValue = (e as Dayjs)?.format('DD/MM/YYYY') || '';
      setFieldsErrors(prev => ({...prev, [targetId]: ''}))
    } else {
      targetId = (e as React.ChangeEvent<HTMLInputElement>).target.id as keyof Employee;
      targetValue = sanitize((e as React.ChangeEvent<HTMLInputElement>).target.value);
    }

    if (type === 'string') {
      if (!isOnlyLetters(targetValue)) {
        if (!wrongValueType.includes(targetId)) {
          setWrongValueType(prev => [...prev, targetId])
          setFieldsErrors(prev => ({...prev, [targetId]: 'This field must contain only letters !'}))
        }
      } else {
        setWrongValueType(prev => prev.filter(field => field !== targetId))
        if (isOnlyLetters(targetValue)) {
          setFormData(prev => ({...prev, [targetId]: sanitize(targetValue)}))
          setFieldsErrors(prev => ({...prev, [targetId]: ''}))
        }
      }
    } else if (type === 'zipCode') {
      if (isNotOnlyDigits(targetValue)) {
        if (!wrongValueType.includes(targetId)) {
          setWrongValueType(prev => [...prev, targetId])
          setFieldsErrors(prev => ({...prev, [targetId]: 'This field must be composed of 5 digits only !'}))
        }
      } else {
        setWrongValueType(prev => prev.filter(field => field !== targetId))
        if (isZipCodeUnderConstruction(targetValue)) {
          setZipCodeCandidate(targetValue)
          setFieldsErrors(prev => ({...prev, [targetId]: ''}))
        }
      }
    } else if (type === 'alphaNumeric') {
      if (!isOnlyAlphanumeric(targetValue)) {
        if (!wrongValueType.includes(targetId)) {
          setWrongValueType(prev => [...prev, targetId])
          setFieldsErrors(prev => ({...prev, [targetId]: 'This field must be alphanumeric !'}))
        }
      } else {
        setWrongValueType(prev => prev.filter(field => field !== targetId))
        setFormData(prev => ({...prev, [targetId]: sanitize(targetValue)}))
        setFieldsErrors(prev => ({...prev, [targetId]: ''}))
      }
    } else {
      setFormData(prev => ({...prev, [targetId]: sanitize(targetValue)}))
    }
  }

  /**
   * Submits the form and updates the employee in the store.
   * Validates the updated employee data and sanitizes it.
   * If the updated employee data is valid, updates the employee in the store and closes the update modal.
   * @param e The form's submit event.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    for (const key in formData) {
      if (key !== 'id' && formData[key as keyof Employee] === '') {
        setFieldsErrors(prev => ({...prev, [key as keyof Employee]: 'This field  is required !'}))
      }
    }

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

    if (isSubmittableFormData(updatedEmployee)) {
      updateEmployee(updatedEmployee);
      setUpdating(false);
    }
  }

  useEffect(() => {
    setFormData(prev => ({...prev, zipCode: ''}))

    if (isValidZipCode(zipCodeCandidate)) {
      setFormData(prev => ({...prev, zipCode: sanitize(zipCodeCandidate)}))
    }
  }, [zipCodeCandidate])

  return (
    <div className='flex flex-col justify-center items-center bg-gray-300 rounded-b-[80px] border-b-2 border-x-2 border-gray-900'>
      <form
        onSubmit={(e) => {
          handleSubmit(e)
        }}
      >
        <div className=' flex flex-col gap-[15px]'>
          <div className='w-full'>
            <div className="flex items-center h-[29px]">
              {fieldsErrors.firstName && <p className='text-red-600 font-bold'>{fieldsErrors.firstName}</p>}
            </div>

            <div className='w-full px-[15px] py-[5px] h-[82px] bg-gray-900 border-2 border-gray-500 rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
              <label htmlFor="first-name" className='block text-white font-bold pb-[5px]'>First Name</label>
              <input
                type="text"
                id="firstName"
                placeholder="John"
                onChange={(e) => handleChange(e, 'string')}
                onBlur={e => {
                  if (!e.target.value) {
                    setFieldsErrors(prev => ({...prev, firstName: 'The First name field is required !'}))
                    setWrongValueType(prev => prev.filter(field => field !== 'firstName'))
                  }
                }}
                value={formData.firstName}
                className='w-full block text-white placeholder:text-gray-400 py-[5px] outline-none pl-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe] rounded-[10px]'
                defaultValue={employeeToUpdate?.firstName}
              />
            </div>
          </div>

          <div className="w-full">
            <div className="flex items-center h-[29px]">
              {fieldsErrors.lastName && <p className='text-red-600 font-bold'>{fieldsErrors.lastName}</p>}
            </div>

            <div className='w-full h-[82px] px-[15px] py-[5px] bg-gray-900 border-2 border-gray-500 rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
              <label htmlFor="last-name" className='block text-white font-bold pb-[5px]'>Last Name</label>
              <input
                type="text"
                id="lastName"
                placeholder="Doe"
                onChange={(e) => handleChange(e, 'string')}
                onBlur={e => {
                  if (!e.target.value) {
                    setFieldsErrors(prev => ({...prev, lastName: 'The Last name field is required !'}))
                    setWrongValueType(prev => prev.filter(field => field !== 'lastName'))
                  }
                }}
                value={formData.lastName}
                className='w-full block text-white placeholder:text-gray-400 py-[5px] outline-none pl-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe] rounded-[10px]'
                defaultValue={employeeToUpdate?.lastName.toUpperCase()}
              />
            </div>
          </div>

          <div className='w-full'>
            <div className="flex items-center h-[29px]">
              {fieldsErrors.dateOfBirth && <p className='text-red-600 font-bold'>{fieldsErrors.dateOfBirth}</p>}
            </div>

            <div className='flex flex-col gap-[5px] h-[82px] px-[15px] pt-[5px] border-2 bg-gray-900 border-gray-500 rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
              <label htmlFor="date-of-birth" className='block text-white font-bold'>Date of Birth</label>
              <div className='rounded-[10px]  hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                <DatePicker
                  name='dateOfBirth'
                  inputReadOnly={true}
                  defaultValue={dayjs(employeeToUpdate?.dateOfBirth)}
                  format='MM/DD/YYYY'
                  onChange={e => handleChange(e, 'date', 'dateOfBirth')}
                  maxDate={dayjs().subtract(18, 'year')}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'white',
                    padding: '5px',
                    width: '100%',
                    height: '35px'
                  }}
                  popupClassName="text-white "
                />
              </div>
            </div>
          </div>

          <div className='w-full'>
            <div className='flex flex-col gap-[5px] px-[15px] pt-[5px] mt-[29px] border-2 bg-gray-900 border-gray-500 rounded-[10px] h-[82px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
              <label htmlFor="start-date" className='block text-white font-bold'>Start Date</label>
              <div className='rounded-[10px]  hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                <DatePicker
                  id="startDate"
                  name='start-date'
                  inputReadOnly={true}
                  defaultValue={dayjs(employeeToUpdate?.startDate)}
                  format='MM/DD/YYYY'
                  onChange={e => handleChange(e, 'date', 'startDate')}
                  maxDate={dayjs()}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'white',
                    padding: '5px',
                    width: '100%',
                    height: '35px'
                  }}
                  popupClassName="text-white "
                />
              </div>
            </div>
          </div>

          <fieldset className="flex flex-col gap-[5px] border-2 border-gray-900 rounded-[20px] px-[25px] pb-[25px] mb-[25px]">
            <legend className="ml-[15px] p-[5px] text-gray-900 font-bold">Address</legend>

            <div className="w-[380px]">
              <div className="flex items-center h-[29px]">
                {fieldsErrors.street && <p className='text-red-600 font-bold'>{fieldsErrors.street}</p>}
              </div>

              <div className='flex flex-col gap-[5px] px-[15px] pt-[5px] border-2 bg-gray-900 border-gray-500 rounded-[10px] h-[82px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                <label htmlFor="street" className='w-full block text-white font-bold'>Street</label>
                <div className='rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                  <input
                    id="street"
                    type="text"
                    onChange={e => handleChange(e, 'alphaNumeric')}
                    onBlur={e => {
                      if (!e.target.value) {
                        setFieldsErrors(prev => ({...prev, street: 'The Street field is required !'}))
                        setWrongValueType(prev => prev.filter(field => field !== 'street'))
                      }
                    }}
                    value={formData.street}
                    className='w-full h-full block text-white placeholder:text-gray-400 py-[5px] outline-none pl-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe] rounded-[10px]'
                    defaultValue={employeeToUpdate?.street}
                  />
                </div>
              </div>
            </div>

            <div className="w-[380px]">
              <div className="flex items-center h-[29px]">
                {fieldsErrors.city && <p className='text-red-600 font-bold'>{fieldsErrors.city}</p>}
              </div>

              <div className='flex flex-col gap-[5px] px-[15px] pt-[5px] border-2 bg-gray-900 border-gray-500 rounded-[10px] h-[82px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                <label htmlFor="city" className='w-full block text-white font-bold'>City</label>
                <div className='rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                  <input
                    id="city"
                    type="text"
                    onChange={e => handleChange(e, 'string')}
                    onBlur={e => {
                      if (!e.target.value) {
                        setFieldsErrors(prev => ({...prev, city: 'The City field is required !'}))
                        setWrongValueType(prev => prev.filter(field => field !== 'city'))
                      }
                    }}
                    value={formData.city}
                    className='w-full h-full block text-white placeholder:text-gray-400 py-[5px] outline-none pl-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe] rounded-[10px]'
                    defaultValue={employeeToUpdate?.city}
                  />
                </div>
              </div>
            </div>

            <div className='w-[380px]'>
              <div className="flex items-center h-[29px]">
                {fieldsErrors.state && <p className='text-red-600 font-bold'>{fieldsErrors.state}</p>}
              </div>

              <div className='flex flex-col gap-[5px] px-[15px] pt-[5px] border-2 bg-gray-900 border-gray-500 rounded-[10px] h-[82px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                <label htmlFor="state" className='w-full block text-white font-bold'>State</label>
                <div className="w-full rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]">
                  <Select
                    id="state"
                    showSearch
                    placeholder="Select a state"
                    value={formData.state.length ? formData.state : null}
                    onChange={(value: string) => {
                      setFormData(prev => ({...prev, state: sanitize(value)}))
                      setFieldsErrors(prev => ({...prev, state: ''}))
                    }}
                    style={{
                      width: '100%',
                      height: '35px',
                    }}
                    dropdownStyle={{
                      color: 'white',
                      border: '2px solid #99a1af'
                    }}
                    options={states}
                  />
                </div>
              </div>
            </div>

            <div className='w-[380px]'>
              <div className="flex items-center h-[29px]">
                {fieldsErrors.zipCode && <p className='text-red-600 font-bold'>{fieldsErrors.zipCode}</p>}
              </div>

              <div className='flex flex-col gap-[5px] w-full px-[15px] py-[5px] h-[82px] border-2 bg-gray-900 border-gray-500 rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                <label htmlFor="zip-code" className='w-full block text-white font-bold'>Zip Code</label>
                <div className='ounded-[10px]  hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                  <input
                    id="zipCode"
                    type="string"
                    onChange={e =>handleChange(e, 'zipCode')}
                    onBlur={e => {
                      if (!e.target.value) {
                        setFieldsErrors(prev => ({...prev, zipCode: 'The Zip Code field is required !'}))
                        setWrongValueType(prev => prev.filter(field => field !== 'zipCode'))
                      }
                    }}
                    value={zipCodeCandidate}
                    className='w-full h-full block text-white placeholder:text-gray-400 py-[5px] outline-none pl-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe] rounded-[10px]'
                    defaultValue={String(employeeToUpdate?.zipCode)}
                  />
                </div>
              </div>
            </div>
          </fieldset>

          <div className='w-full'>
            <div className='flex flex-col gap-[5px] w-full px-[15px] py-[5px] h-[82px] border-2 bg-gray-900 border-gray-500 rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
              <label htmlFor="department" className='block text-white font-bold'>Department</label>
              <div className="rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]">
                <Select
                  id="department"
                  showSearch
                  placeholder="Select a department"
                  optionFilterProp="label"
                  value={formData.department.length ? formData.department : null}
                  onChange={(value: string) => {
                    setFormData(prev => ({...prev, department: sanitize(value)}))
                    setFieldsErrors(prev => ({...prev, department: ''}))
                  }}
                  style={{
                    width: '100%',
                    height: '35px',
                  }}
                  dropdownStyle={{
                    color: 'white',
                    border: '2px solid #99a1af'
                  }}
                  options={[
                    {
                      value: 'Sales',
                      label: 'Sales',
                    },
                    {
                      value: 'Engineering',
                      label: 'Engineering',
                    },
                    {
                      value: 'Human Resources',
                      label: 'Human Resources',
                    },
                    {
                      value: 'Legal',
                      label: 'Legal',
                    },
                  ]}
                />
              </div>
            </div>
          </div>
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