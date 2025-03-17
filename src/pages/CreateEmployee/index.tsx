import { Button, DatePicker, Modal } from "antd";
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useEmployeeStore from '../../app/hooks/store';
import { Employee, USStates } from '../../common/types';
import sanitize from "../../tools/sanitize";
import validateEmployeeFormData from "../../tools/validateEmployeeFormData";

/**
 * A React component that renders a form to create a new employee.
 * The component uses the `useEmployeeStore` hook to access the employee store.
 * The component uses the `useNavigate` hook to navigate to the homepage after submitting the form.
 * The component uses the `useState` hook to manage the state of the form data.
 * The component renders a form with inputs for the employee's first name, last name, date of birth, start date, street, city, state, zip code, and department.
 * The component renders a button to submit the form.
 * The component renders a button to cancel the form.
 * The component renders a modal to display a success message after submitting the form.
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
   * If the input element is a date picker, the value is formatted as 'YYYY-MM-DD'.
   * Checks if the input element corresponds to an empty field and removes it from the emptyFields array if it is not empty.
   * @param e The input element's change event, a Dayjs object, a string, or null.
   * @param dateId Optional key of the formData state to update when using a date picker.
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
   * Submits the form and adds a new employee to the store.
   * Validates inputs and sets the emptyFields state if a required field is empty.
   * If the inputs are valid, sanitizes the new employee data and adds it to the store,
   * displays a success modal, and redirects to the homepage.
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

    if (validateEmployeeFormData(formData)) {
      const newEmployee: Employee = {
        id: Date.now().toString(),
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
    <main className="mt-[250px] mb-[100px]">
      <div className="bg-gray-300 rounded-[80px] w-[500px] mt-[25px]">
        <h2 className='text-center bg-gray-900 text-white font-bold text-4xl py-[25px] rounded-t-[80px]'>Create an Employee</h2>
        <div className='flex flex-col items-center justify-center pt-[25px] pb-[50px] border-b-2 border-x-2 border-gray-900 rounded-b-[80px]'>
          <form onSubmit={handleSubmit} >
            <div className="flex flex-col gap-[15px]">
              <div className='w-auto'>
                <div className='px-[15px] py-[5px] bg-gray-900 border-2 border-gray-500 rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                  <div className={`text-red-600 ${(!submitting && emptyFields.includes('firstName')) ? '' : 'hidden'}`}>
                    The <span className='font-bold'>First name</span> field is required !
                  </div>

                  <label htmlFor="firstName" className='block text-white font-bold'>First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    placeholder="first name"
                    onChange={handleChange}
                    className='block text-white placeholder:text-gray-400 h-[40px] outline-none pl-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe] rounded-[10px]'
                  />
                </div>
              </div>
              
              <div className='px-[15px] py-[5px] bg-gray-900 border-2 border-gray-500 rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                <div className={`text-red-600 ${(!submitting && emptyFields.includes('lastName'))  ? '' : 'hidden'}`}>
                  The <span className='font-bold'>Last name</span> field is required !
                </div>

                <label htmlFor="lastName" className='block text-white font-bold'>Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Doe"
                  onChange={handleChange}
                  className='block text-white placeholder:text-gray-400 h-[40px] outline-none pl-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe] rounded-[10px]'
                />
              </div>

              <div className='px-[15px] pt-[5px] border-2 bg-gray-900 border-gray-500 rounded-[10px] h-[78px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                <div className={`text-red-600 ${!submitting && emptyFields.includes('dateOfBirth') ? 'block' : 'hidden'}`}>
                  The <span className='font-bold'>Date of birth</span> field is required !
                </div>

                <label htmlFor="dateOfBirth" className='block text-white font-bold'>Date of Birth</label>
                <DatePicker
                  id="dateOfBirth"
                  name='dateOfBirth'
                  inputReadOnly= {true}
                  onChange={e => handleChange(e, 'dateOfBirth')}
                  maxDate={dayjs().subtract(18, 'year')}
                  style={{border: 'none', backgroundColor: 'transparent', color: 'white', padding: '5px'}}
                  popupClassName="text-white "
                />
              </div>

              <div className='px-[15px] pt-[5px] border-2 bg-gray-900 border-gray-500 rounded-[10px] h-[78px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                <div className={`text-red-600 ${!submitting && emptyFields.includes('startDate') ? 'block' : 'hidden'}`}>
                  The <span className='font-bold'>Date of beginning</span> field is required !
                </div>

                <label htmlFor="startDate" className='block text-white font-bold'>Date of beginning</label>
                <DatePicker
                  id="startDate"
                  name='startDate'
                  inputReadOnly= {true}
                  defaultValue={dayjs()}
                  onChange={e => handleChange(e, 'startDate')}
                  maxDate={dayjs()}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: 'white',
                    padding: '5px',
                  }}
                  className="datepicker"
                />
              </div>
              
              <fieldset className="flex flex-col gap-[10px] border-2 border-gray-500 rounded-[12px] p-[10px]">
                <legend className="ml-[10px] p-[5px] text-gray-900 font-bold">Address</legend>

                <div className='px-[15px] py-[5px] border-2 bg-gray-900 border-gray-500 rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                  <div className={`text-red-600 ${!submitting && emptyFields.includes('street') ? 'block' : 'hidden'}`}>
                    The <span className='font-bold'>Street</span> field is required !
                  </div>

                  <label htmlFor="street" className='block text-white font-bold'>Street</label>
                  <input
                    id="street"
                    type="text"
                    onChange={handleChange}
                    className='block text-white placeholder:text-gray-400 h-[40px] outline-none pl-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe] rounded-[10px]'
                    placeholder="No Where Street"
                  />
                </div>

                <div className='px-[15px] py-[5px] border-2 bg-gray-900 border-gray-500 rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                  <div className={`text-red-600 ${!submitting && emptyFields.includes('city') ? 'block' : 'hidden'}`}>
                    The <span className='font-bold'>City</span> field is required !
                  </div>

                  <label htmlFor="city" className='block text-white font-bold'>City</label>
                  <input
                    id="city"
                    type="text"
                    onChange={handleChange}
                    className='block text-white placeholder:text-gray-400 h-[40px] outline-none pl-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe] rounded-[10px]'
                    placeholder='Notown City'
                  />
                </div>

                <div className='px-[15px] py-[5px] border-2 bg-gray-900 border-gray-500 rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                  <div className={`text-red-600 ${!submitting && emptyFields.includes('state') ? '' : 'hidden'}`}>
                    The <span className='font-bold'>State</span> field is required !
                  </div>

                  <label htmlFor="state" className='block text-white font-bold'>State</label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={handleChange}
                    className='block text-white placeholder:text-gray-400 h-[40px] outline-none pl-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe] rounded-[10px]'
                  >
                  {Object.values(USStates).map((state: string, index: number) => (
                    <option key={index} value={state} className="text-black">{state}</option>
                  ))}
                  </select>
                </div>

                <div className='px-[15px] py-[5px] border-2 bg-gray-900 border-gray-500 rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                  <label htmlFor="zipCode" className='block text-white font-bold'>Zip Code</label>
                  <input
                    id="zipCode"
                    type="number"
                    min="0"
                    defaultValue={'00000'}
                    onChange={handleChange}
                    className='block text-white placeholder:text-gray-400 h-[40px] outline-none pl-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe] rounded-[10px]'
                  />
                </div>
              </fieldset>

              <div className='px-[15px] py-[5px] border-2 bg-gray-900 border-gray-500 rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                <div key={emptyFields.indexOf('department')} className={`text-red-600 ${!submitting && emptyFields.includes('department') ? 'block' : 'hidden'}`}>
                  The <span className='font-bold'>Department</span> field is required !
                </div>

                <label htmlFor="department" className='block text-white font-bold'>Department</label>
                <select
                  id="department"
                  onChange={handleChange}
                  className='block text-white  h-[40px] outline-none pl-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe] rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]'
                >
                  <option value="" className="text-black" >Select a department</option>
                  <option value="Sales" className="text-black" >Sales</option>
                  <option value="Engineering" className="text-black" >Engineering</option>
                  <option value="Human Resources" className="text-black" >Human Resources</option>
                  <option value="Legal" className="text-black" >Legal</option>
                </select>
              </div>
            </div>

            <div className='flex mt-[50px] gap-[15px] justify-center'>
              <button
                type='submit'
                className='bg-[#105924]/80 hover:bg-[#105924] text-white font-bold rounded-[20px] px-[15px] py-[8px] hover:shadow-[0_0_7px_2px_#00c700]'
              >
                Save
              </button>
              
              <button
                type='reset'
                className='bg-[#105924]/80 hover:bg-[#105924] text-white font-bold rounded-[20px] px-[15px] py-[8px] hover:shadow-[0_0_7px_2px_#00c700]'
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
      </div>
    </main>
  )
}

export default CreateEmployee;