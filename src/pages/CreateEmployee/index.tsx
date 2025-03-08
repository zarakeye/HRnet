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
 * Component for creating a new employee record within the application.
 * It renders a form with fields for employee details including first name, last name,
 * date of birth, start date, address (street, city, state, zip code), and department.
 * The form validates inputs and highlights empty required fields. On successful
 * submission, it sanitizes and adds the new employee data to the store, displays
 * a success modal, and redirects to the homepage. Includes options to save or
 * cancel the operation.
 * Utilizes 'antd' components for date picking and modals, and 'dayjs' for date formatting.
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
   * If the input element is empty, the key is not removed from the emptyFields array.
   * If the input element is not empty and is in the emptyFields array, the key is removed from the emptyFields array.
   * @param e The input element's change event or a Dayjs object or a string or null.
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
   * Handles form submission by first checking for empty fields and adding them to the emptyFields state array.
   * Then, if the form data is valid, it creates a new employee object with the sanitized form data, adds it to the store, and sets the submitting state to true.
   * Finally, it sets the submitting state to false.
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
      <div className="bg-[#105924]/20 rounded-[40px] w-[500px] mt-[25px]">
        <h2 className='text-center bg-[#105924] text-white font-bold text-4xl py-[25px] rounded-t-[40px]'>Create an Employee</h2>
        <div className='flex flex-col items-center justify-center pt-[25px] pb-[50px]'>
          <form onSubmit={handleSubmit} >
            <div className='w-auto'>
              <div className={`text-red-600 ${(!submitting && emptyFields.includes('firstName')) ? '' : 'hidden'}`}>
                The <span className='font-bold'>First name</span> field is required !
              </div>

              <label htmlFor="first-name" className='block text-[#105924] font-bold'>First Name</label>
              <input
                type="text"
                id="firstName"
                placeholder="John"
                onChange={handleChange}
                className='block border-2 border-[#105924]/70 bg-white rounded-[5px] pl-[5px]'
              />
            </div>
            
            <div className='my-1.5'>
              <div className={`text-red-600 ${(!submitting && emptyFields.includes('lastName'))  ? '' : 'hidden'}`}>
                The <span className='font-bold'>Last name</span> field is required !
              </div>

              <label htmlFor="last-name" className='block text-[#105924] font-bold'>Last Name</label>
              <input
                type="text"
                id="lastName"
                placeholder="Doe"
                onChange={handleChange}
                className='block border-2  border-[#105924]/70 bg-white rounded-[5px] pl-[5px]'
              />
            </div>

            <div className='my-1.5'>
              <div className={`text-red-600 ${!submitting && emptyFields.includes('dateOfBirth') ? 'block' : 'hidden'}`}>
                The <span className='font-bold'>Date of birth</span> field is required !
              </div>

              <label htmlFor="date-of-birth" className='block text-[#105924] font-bold'>Date of Birth</label>
              <DatePicker
                name='date-of-birth'
                inputReadOnly= {true}
                onChange={e => handleChange(e, 'dateOfBirth')}
                maxDate={dayjs().subtract(18, 'year')}
                style={{border: '2px solid #498058', borderRadius: '5px', padding: '5px'}}
              />
            </div>

            <div className='my-1.5'>
              <div className={`text-red-600 ${!submitting && emptyFields.includes('startDate') ? 'block' : 'hidden'}`}>
                The <span className='font-bold'>Date of beginning</span> field is required !
              </div>

              <label htmlFor="start-date" className='block text-[#105924] font-bold'>Date of beginning</label>
              <DatePicker
                id="startDate"
                name='start-date'
                inputReadOnly= {true}
                defaultValue={dayjs()}
                onChange={e => handleChange(e, 'startDate')}
                maxDate={dayjs()}
                style={{border: '2px solid #498058', borderRadius: '5px', padding: '5px'}}
              />
            </div>
            
            <fieldset className="border-2 border-[#105924]/70 rounded-[5px] pb-[10px]">
              <legend className="ml-[10px] p-[5px] text-[#105924] font-bold">Address</legend>

              <div className='ml-[10px] my-1.5'>
                <div className={`text-red-600 ${!submitting && emptyFields.includes('street') ? 'block' : 'hidden'}`}>
                  The <span className='font-bold'>Street</span> field is required !
                </div>

                <label htmlFor="street" className='block text-[#105924] font-bold'>Street</label>
                <input
                  id="street"
                  type="text"
                  onChange={handleChange}
                  className='block border-2 border-[#105924]/70 bg-white rounded-[5px] pl-[5px]'
                  placeholder="No Where Street"
                />
              </div>

              <div className='ml-[10px] my-1.5'>
                <div className={`text-red-600 ${!submitting && emptyFields.includes('city') ? 'block' : 'hidden'}`}>
                  The <span className='font-bold'>City</span> field is required !
                </div>

                <label htmlFor="city" className='block text-[#105924] font-bold'>City</label>
                <input
                  id="city"
                  type="text"
                  onChange={handleChange}
                  className='block border-2 border-[#105924]/70 bg-white rounded-[5px] pl-[5px]'
                  placeholder='Notown City'
                />
              </div>

              <div className='ml-[10px] my-1.5 mr-[10px]'>
                <div className={`text-red-600 ${!submitting && emptyFields.includes('state') ? '' : 'hidden'}`}>
                  The <span className='font-bold'>State</span> field is required !
                </div>

                <label htmlFor="state" className='block text-[#105924] font-bold'>State</label>
                <select
                  id="state"
                  value={formData.state}
                  onChange={handleChange}
                  className='block border-2 border-[#105924]/70 bg-white rounded-[5px] pl-[5px]'
                >
                {Object.values(USStates).map((state: string, index: number) => (
                  <option key={index} value={state}>{state}</option>
                ))}
                </select>
              </div>

              <div className='ml-[10px] my-1.5'>
                <label htmlFor="zipCode" className='block text-[#105924] font-bold'>Zip Code</label>
                <input
                  id="zipCode"
                  type="number"
                  min="0"
                  defaultValue={'00000'}
                  onChange={handleChange}
                  className='block border-2 border-[#105924]/70 bg-white rounded-[5px] pl-[5px]'
                />
              </div>
            </fieldset>

            <div className='my-1.5'>
              <div key={emptyFields.indexOf('department')} className={`text-red-600 ${!submitting && emptyFields.includes('department') ? 'block' : 'hidden'}`}>
                The <span className='font-bold'>Department</span> field is required !
              </div>

              <label htmlFor="department" className='block text-[#105924] font-bold'>Department</label>
              <select
                id="department"
                onChange={handleChange}
                className='block border-2 border-[#105924]/70 bg-white rounded-[5px] pl-[5px]'
              >
                <option value="" >Select a department</option>
                <option value="Sales">Sales</option>
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Legal">Legal</option>
              </select>
            </div>

            <div className='flex mt-[50px] gap-[15px] justify-center'>
              <button
                type='submit'
                className='bg-[#105924] hover:bg-[#105924]/80 text-white font-bold rounded-[20px] px-[15px] py-[8px]'
              >
                Save
              </button>
              
              <button
                type='reset'
                className='bg-[#105924] hover:bg-[#105924]/80 text-white font-bold rounded-[20px] px-[15px] py-[8px]'
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