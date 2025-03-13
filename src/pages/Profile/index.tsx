import React, { /*Suspense,*/ useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useEmployeeStore from '../../app/hooks/store';
const DeleteEmployee = React.lazy(() => import('../../components/DeleteEmployee'));
const UpdateEmployee = React.lazy(() => import('../../components/UpdateEmployee'));

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
  const employee = employees.find((employee) => employee.id === id);
  const [updating, setUpdating] = useState<boolean>(false);

  return (
    <main className='flex flex-col justify-center rounded-[80px] mt-[250px] mb-[100px]'>
      <div className=' rounded-[80px] w-[500px]'>
        <div className={`bg-gray-300 border-x-2 border-gray-900 rounded-t-[80px] ${!updating ? 'rounded-b-[80px]': ''}`}>
          <h2 className='flex-1 text-3xl bg-gray-900 border-2 border-gray-900 text-center text-white font-bold p-[40px] rounded-t-[80px]'><span className='sr-only'>Profile of </span>{employee?.firstName} {employee?.lastName.toUpperCase()}</h2>

          <div className={`${updating ? '' : 'border-b-2 '}border-x-2 border-gray-300 ${updating ? '' : 'rounded-b-[80px]'} `}>
            <div className='pl-[70px] pt-[40px]'>
                <p className='font-bold text-[#105924]'>Identifier:</p>
                <p className='pl-[10px]'>{employee?.id}</p>
            </div>

            <div hidden={updating} >
              <div className='pl-[70px] mt-[25px] mb-[25px]'>
                <p className='font-bold text-[#105924]'>Date of Birth:</p>
                <p className='pl-[10px]'>{employee?.dateOfBirth}</p>
              </div>

              <div className='pl-[70px] mb-[25px]'>
                  <p className='font-bold text-[#105924]'>Start Date:</p>
                  <p  className='pl-[10px]'>{employee?.startDate}</p>
              </div>

              <div className='pl-[70px] mb-[25px]'>
                <p className='font-bold text-[#105924]'>Address:</p>
                <p className='pl-[20px]'>{employee?.street}</p>
                <p className='pl-[20px]'>{employee?.city}</p>
                <p className='pl-[20px]'>{employee?.state}</p>
                <p className='pl-[20px]'>{employee?.zipCode}</p>
              </div>

              <div className='pl-[70px] mb-[25px]'>
                <p className='font-bold text-[#105924]'>Department:</p>
                <p className='pl-[20px]'>{employee?.department}</p>
              </div>

              <div className='flex flex-col justify-center items-center mt-[30px]'>
                <button type="button" className='bg-[#105924] hover:bg-[#105924]/80 hover:shadow-[0_0_7px_1px_#7f7fbe] text-white font-bold rounded-[20px] px-[15px] py-[8px] mt-[25px] mb-[40px] cursor-pointer' onClick={() => setUpdating(true)/*navigate(`/update-employee/${employee?.id}`)*/}>
                  Update
                </button>
                <button type="button" className='flex px-[10px] pb-[50px] font-bold text-[#105924] cursor-pointer' onClick={() => navigate('/')}>
                  <svg className='inline-block' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#105924"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg> Back to the list of employees
                </button>
              </div>
            </div>
          </div>
        </div>

        {updating && id && (
          <div className=' rounded-b-[80px]'>
            {/* <Suspense fallback={<div>Loading...</div>}> */}
              <UpdateEmployee
                id={id}
                setUpdating={setUpdating}
              />
            {/* </Suspense> */}
          </div>
        )}
      </div>

      <div className='flex flex-col justify-center items-center text-center m-[20px]'>
        <button type="button" className='bg-[#B30000] hover:bg-[#B30000]-500/80 hover:shadow-[0_0_7px_3px_#9f0712] text-white font-bold rounded-[20px] px-[15px] py-[5px] cursor-pointer' onClick={() => setDisplayDeleteModal(true)}>
          Delete
        </button>
      </div>

      {id && (
        // <Suspense fallback={<div>Loading...</div>}>
          <DeleteEmployee 
            id={id}
            displayDeleteModal={displayDeleteModal}
            setDisplayDeleteModal={setDisplayDeleteModal}
          />
        // </Suspense>
      )}
    </main>
  )
}

export default Profile;