import { DatePicker, Modal, Button } from "antd";
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmployeeStore from '../../app/hooks/store';
import { Employee, USStates } from '../../common/types';
import type { Dayjs } from 'dayjs';

/**
 * This component renders a form to create a new employee.
 * It handles the validation of the form and the submission of the form.
 * The form is validated by checking that all the required fields are filled.
 * The submission of the form is handled by adding the new employee to the store and navigating to the homepage.
 * The component also displays a confirmation message when the employee is created successfully.
 * @returns {JSX.Element} The form component.
 */
function CreateEmployee (): JSX.Element {
  const [creationSuccess, setCreationSuccess] = useState<boolean | null>(null);
  const [employeeFormData, setEmployeeFormData] = useState<Employee | null>(null);
  const addEmployee = useEmployeeStore(state => state.addEmployee);
  const employees = useEmployeeStore(state => state.employees);
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

  /**
   * Updates the formData state with the value from the input element.
   * If the input element is a date picker, the value is converted to a string in the format 'YYYY-MM-DD'.
   * If the input element is empty, the key is added to the emptyFields array.
   * If the input element is not empty and is in the emptyFields array, the key is removed from the emptyFields array.
   * @param e The input element's change event.
   * @param dateId The key of the formData state to update.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement > | Dayjs | string | null, dateId?: keyof Employee) => {
    setSubmitting(false)
    let targetId: keyof Employee;
    let targetValue: string | number | null;

    if (dateId) {
      targetId = dateId;
      targetValue = (e as Dayjs)?.format('YYYY-MM-DD') || '';
    } else {
      targetId = (e as React.ChangeEvent<HTMLInputElement>).target.id as keyof Employee;
      targetValue = (e as React.ChangeEvent<HTMLInputElement>).target.value;
    }

    setFormData(prev => ({...prev, [targetId]: targetValue}))

    if (emptyFields.includes(targetId)) {
      setEmptyFields(prev => prev.filter(field => field !== targetId))
    }
  }

  /**
   * Validates the form data to ensure all required fields are filled.
   * Checks if first name, last name, date of birth, start date, street, city, 
   * state, zip code, and department are not empty or null.
   * 
   * @returns {boolean} True if all fields are valid, false otherwise.
   */
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

  /**
   * Submits the form, adding the new employee to the store and navigating to the homepage.
   * Checks for empty fields, and if there are any, sets the emptyFields state to include them, and sets submitting to false.
   * If there are no empty fields, creates a new employee object, sets submitting to true, adds it to the store, and navigates to the homepage.
   * @param e The form's submit event.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

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

      setEmployeeFormData(newEmployee)


      setSubmitting(true)
      addEmployee(newEmployee);
    }

    setSubmitting(false);
  }

  /**
   * Closes the confirmation modal and navigates to the homepage.
   */
  const handleModalClick = () => {
    setCreationSuccess(false);
    navigate('/');
  }

  useEffect(() => {
    const employeeisAdded = employees.some(employee => employee.id === employeeFormData?.id);
    if (employeeisAdded) setCreationSuccess(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees])

  return (
    <>
      <h2 className='text-center text-[#105924] font-bold text-4xl py-[25px]'>Create an Employee</h2>
      <div className='flex flex-col items-center justify-center'>
        <form onSubmit={handleSubmit} >
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

        <Modal
          open={creationSuccess === true}
          centered
          footer={[
            <Button key="submit" type="primary" style={{ backgroundColor: 'oklch(0.577 0.245 27.325)' }} onClick={handleModalClick}>
              OK
            </Button>,
          ]}
        >
          <p className='text-center'>Employee created successfully</p>
        </Modal>

      </div>
    </>
  )
}

export default CreateEmployee;