import { useState, lazy, ReactNode, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useEmployeeStore from '../../app/hooks/useEmployeeStore';
import { Employee } from '../../common/types';

const DeleteEmployee = lazy(() => import('../../components/DeleteEmployee'));
const UpdateEmployee = lazy(() => import('../../components/UpdateEmployee'));

/**
 * Component for displaying the profile of an employee within the application.
 * It renders a card with the employee's details including identifier, date of birth,
 * start date, address (street, city, state, zip code), and department.
 * The component also includes options to update or delete the employee record.
 * The component uses the useParams hook to fetch the employee's id from the URL
 * and the useEmployeeStore hook to fetch the employee data from the store.
 * The component uses the useState hook to track the state of the delete and update modals.
 * The component renders the update and delete modals conditionally based on the state.
 * The component uses the navigate hook to navigate to the homepage when the back button is clicked.
 */
function Profile(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const [displayDeleteModal, setDisplayDeleteModal] = useState<boolean>(false);
  const employees = useEmployeeStore(state => state.employees);
  const [employee, setEmployee] = useState<Employee>();
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    const employee = employees.find((employee) => employee.id === id);
    setEmployee(employee);
  }, [employees, id]);

  /**
   * Converts a date string into a formatted JSX span element.
   * The date is formatted as 'DD/MM/YYYY', where days and months are zero-padded if necessary.
   * @param dateString A string representation of a date.
   * @returns A ReactNode containing the formatted date.
   */
  function renderDate(dateString: string):ReactNode {
    const date = new Date(dateString);
    
    return (
      <span>{date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/{(date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}/{date.getFullYear()}</span>
    )
  }

  return (
    <main className='flex flex-col justify-center rounded-[80px] mt-[250px] mb-[100px]'>
      <div className=' rounded-[80px] w-[500px]'>
        <div className={`bg-gray-300 border-x-2 border-gray-900 rounded-t-[80px] ${!updating ? 'rounded-b-[80px]': ''}`}>
          <h2 className='flex-1 text-3xl bg-gray-900 border-2 border-gray-900 text-center text-white font-bold p-[40px] rounded-t-[80px]'><span className='sr-only'>Profile of </span>{employee?.firstName} {employee?.lastName.toUpperCase()}</h2>

          <div className={`border-gray-900 `}>
            <div className='pl-[70px] pt-[40px]'>
                <p className='font-bold text-gray-900'>Identifier:</p>
                <p className='pl-[10px]'>{employee?.id}</p>
            </div>

            <div hidden={updating} className='border-b-2 border-gray-900 rounded-b-[80px] mt-[40px]' >
              <div className='pl-[70px] mb-[40px]'>
                <p className='font-bold text-gray-900'>Date of Birth:</p>
                <p className='pl-[10px]'>{renderDate(String(employee?.dateOfBirth))}</p>
              </div>

              <div className='pl-[70px] mb-[40px]'>
                  <p className='font-bold text-gray-900'>Start Date:</p>
                  <p  className='pl-[10px]'>{renderDate(String(employee?.startDate))}</p>
              </div>

              <div className='pl-[70px] mb-[40px]'>
                <p className='font-bold text-gray-900'>Address:</p>
                <p className='pl-[20px]'>{employee?.street}</p>
                <p className='pl-[20px]'>{employee?.city}</p>
                <p className='pl-[20px]'>{employee?.state}</p>
                <p className='pl-[20px]'>{employee?.zipCode}</p>
              </div>

              <div className='pl-[70px] mb-[25px]'>
                <p className='font-bold text-gray-900'>Department:</p>
                <p className='pl-[20px]'>{employee?.department}</p>
              </div>

              <div className='flex flex-col justify-center items-center mt-[30px]'>
                <button type="button" className='bg-[#105924] hover:bg-[#105924]/80 hover:shadow-[0_0_7px_1px_#7f7fbe] text-white font-bold rounded-[20px] px-[15px] py-[8px] mt-[25px] mb-[40px] cursor-pointer' onClick={() => setUpdating(true)/*navigate(`/update-employee/${employee?.id}`)*/}>
                  Update
                </button>
                <button type="button" className='flex px-[10px] pb-[50px] font-bold text-gray-900 cursor-pointer' onClick={() => navigate('/')}>
                  <svg className='inline-block' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#101828"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg> Back to the list of employees
                </button>
              </div>
            </div>
          </div>
        </div>

        {updating && id && (
          <div className=' rounded-b-[80px]'>
            <UpdateEmployee
              id={id}
              setUpdating={setUpdating}
            />
          </div>
        )}
      </div>

      <div className='flex flex-col justify-center items-center text-center m-[20px]'>
        <button type="button" className='bg-[#B30000] hover:bg-[#B30000]-500/80 hover:shadow-[0_0_7px_3px_#9f0712] text-white font-bold rounded-[20px] px-[15px] py-[5px] cursor-pointer' onClick={() => setDisplayDeleteModal(true)}>
          Delete
        </button>
      </div>

      {id && (
        <DeleteEmployee 
          id={id}
          displayDeleteModal={displayDeleteModal}
          setDisplayDeleteModal={setDisplayDeleteModal}
        />
      )}
    </main>
  )
}

export default Profile;