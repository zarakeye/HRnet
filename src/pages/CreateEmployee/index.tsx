import { Button, DatePicker, Modal, Select } from "antd";
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
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
  const employees = useEmployeeStore(state => state.employees);
  const addEmployee = useEmployeeStore(state => state.addEmployee);
  const [employeeFormData, setEmployeeFormData] = useState<Employee | null>(null);
  const [creationSuccess, setCreationSuccess] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const [states, setStates] = useState<Array<{label: string, value: string}>>([]);

  const [formData, setFormData] = useState<Employee>({
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    startDate: dayjs(Date.now()).format('YYYY-MM-DD'),
    street: '',
    city: '',
    state: '',
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement > | Dayjs | string | null, dateId?: keyof Employee) => {
    setSubmitting(false)
    let targetId: keyof Employee;
    let targetValue: string | number | null;

    if (dateId) {
      targetId = dateId;
      targetValue = (e as Dayjs)?.format('YYYY-MM-DD') || '';
    } else {
      targetId = (e as React.ChangeEvent<HTMLInputElement>).target.id as keyof Employee;
      targetValue = sanitize((e as React.ChangeEvent<HTMLInputElement>).target.value);
    }

    setFormData(prev => ({...prev, [targetId]: sanitize(targetValue)}))

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
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        dateOfBirth: formData.dateOfBirth.trim(),
        startDate: formData.startDate.trim(),
        street: formData.street.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
        department: formData.department.trim()
      };

      setEmployeeFormData(newEmployee)

      setSubmitting(true)
      addEmployee(newEmployee);
    }

    setSubmitting(false);
  }

  const formRef = useRef<HTMLFormElement>(null);

 
  /**
   * Resets the state of the CreateEmployee component when the modal is closed.
   * Clears the creationSuccess state and resets the formData and emptyFields states.
   */
  const handleModalClick = () => {
    setCreationSuccess(null);

    setFormData({
      id: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      startDate: dayjs(Date.now()).format('YYYY-MM-DD'),
      street: '',
      city: '',
      state: '',
      zipCode: '00000',
      department: ''
    });
    setEmptyFields([]);
  }

  useEffect(() => {
    const employeeisAdded = employees.some(employee => employee.id === employeeFormData?.id);
    if (employeeisAdded) {
      setCreationSuccess(true);
    } else {
      setCreationSuccess(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees])

  useEffect(() => {
    const statesArray = Object.values(USStates).map(state => ({
      label: state,
      value: state
    }));

    setStates(statesArray);
  }, [])

  return (
    <main className="mt-[250px] mb-[100px]">
      <div className="bg-gray-300 rounded-[80px] w-[500px] mt-[25px]">
        <h2 className='text-center bg-gray-900 text-white font-bold text-4xl py-[25px] rounded-t-[80px]'>Create an Employee</h2>
        <div className='flex flex-col items-center justify-center pt-[25px] pb-[50px] border-b-2 border-x-2 border-gray-900 rounded-b-[80px]'>
          <form ref={formRef} onSubmit={handleSubmit} >
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
                    value={formData.firstName}
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
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className='block text-white placeholder:text-gray-400 h-[40px] outline-none pl-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe] rounded-[10px]'
                />
              </div>

              <div className='px-[15px] pt-[5px] border-2 bg-gray-900 border-gray-500 rounded-[10px] h-[78px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                <div className={`text-red-600 ${!submitting && emptyFields.includes('dateOfBirth') ? 'block' : 'hidden'}`}>
                  The <span className='font-bold'>Date of birth</span> field is required !
                </div>

                <label htmlFor="dateOfBirth" className='block text-white font-bold'>Date of Birth</label>
                <div className="rounded-[10px] bg-gray-900 border-gray-500 hover:shadow-[0_0_7px_0px_#7f7fbe]">
                  <DatePicker
                    id="dateOfBirth"
                    name='dateOfBirth'
                    format="DD-MM-YYYY"
                    inputReadOnly= {true}
                    onChange={e => handleChange(e, 'dateOfBirth')}
                    maxDate={dayjs()}
                    value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'white',
                      padding: '5px',
                      width: '100%'
                    }}
                    popupClassName="text-white "
                  />
                </div>
              </div>

              <div className='px-[15px] pt-[5px] border-2 bg-gray-900 border-gray-500 rounded-[10px] h-[78px] hover:shadow-[0_0_7px_0px_#7f7fbe]'>
                <div className={`text-red-600 ${!submitting && emptyFields.includes('startDate') ? 'block' : 'hidden'}`}>
                  The <span className='font-bold'>Date of beginning</span> field is required !
                </div>

                <label htmlFor="startDate" className='block text-white font-bold'>Date of beginning</label>
                <div className="rounded-[10px] bg-gray-900 border-gray-500 hover:shadow-[0_0_7px_0px_#7f7fbe]">
                  <DatePicker
                    id="startDate"
                    name='startDate'
                    format="DD-MM-YYYY"
                    inputReadOnly= {true}
                    defaultValue={dayjs()}
                    onChange={e => handleChange(e, 'startDate')}
                    maxDate={dayjs()}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'white',
                      padding: '5px',
                      width: '100%',
                    }}
                  />
                </div>
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
                    value={formData.street}
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
                    value={formData.city}
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
                  <div className="rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]">
                    <Select
                      id="state"
                      showSearch
                      placeholder="Select a state"
                      value={formData.state.length ? formData.state : null}
                      onChange={(value: string) => setFormData(prev => ({...prev, state: value}))}
                      style={{
                        width: '100%',
                        height: '40px',
                      }}
                      dropdownStyle={{
                        color: 'white',
                        border: '2px solid #99a1af'
                      }}
                      options={states}
                    />
                  </div>
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
                <div className="rounded-[10px] hover:shadow-[0_0_7px_0px_#7f7fbe]">
                  <Select
                    id="department"
                    showSearch
                    placeholder="Select a department"
                    optionFilterProp="label"
                    value={formData.department.length ? formData.department : null}
                    onChange={(value: string) => setFormData(prev => ({...prev, department: value}))}
                    style={{
                      width: '100%',
                      height: '40px',
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

            <div className='flex mt-[50px] gap-[15px] justify-center'>
              <button
                type='submit'
                className='bg-[#105924]/80 hover:bg-[#105924] text-white font-bold rounded-[20px] px-[15px] py-[8px] hover:shadow-[0_0_7px_1px_#7f7fbe]'
              >
                Save
              </button>
              
              <button
                type='reset'
                className='bg-[#105924]/80 hover:bg-[#105924] text-white font-bold rounded-[20px] px-[15px] py-[8px] hover:shadow-[0_0_7px_1px_#7f7fbe]'
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
                <Button
                  key="back"
                  onClick={() => navigate('/')}
                  style={{
                    backgroundColor: '#105924',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '0 15px'
                  }}
                >
                  Back to employees list
                </Button>,
                <Button
                  key="submit"
                  style={{
                    backgroundColor: '#B30000',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    padding: '0 15px'
                  }}
                  onClick={handleModalClick}
                >
                  Create another employee
                </Button>,

            ]}
            closeIcon={false}
            
            style={{
              color: 'white'
            }}
          >
            <p className='text-center'>Employee created successfully</p>
          </Modal>
        </div>
      </div>
    </main>
  )
}

export default CreateEmployee;