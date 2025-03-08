import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useEmployeeStore from '../../app/hooks/store';
import DeleteEmployee from '../../components/DeleteEmployee';
import UpdateEmployee from '../../components/UpdateEmployee';

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
    <main className='flex flex-col justify-center mt-[250px] mb-[100px]'>
      <div className='bg-[#105924]/20 rounded-[40px] w-[500px]'>
        <div>
            <h2 className='flex-1 text-3xl bg-[#105924] text-center text-white font-bold p-[40px] rounded-t-[40px]'><span className='sr-only'>Profile of </span>{employee?.firstName} {employee?.lastName.toUpperCase()}</h2>
            <div className='pl-[40px] mt-[25px] mb-[25px]'>
              <div className='border-l-2 border-[#105924] pl-[30px]'>
                <p className='font-bold text-[#105924]'>Identifier:</p>
                <p className='pl-[10px]'>{employee?.id}</p>
              </div>
            </div>

          <div hidden={updating} >
            <div className='pl-[40px] mt-[25px] mb-[25px]'>
              <div className='border-l-2 border-[#105924] pl-[30px]'>
                <p className='font-bold text-[#105924]'>Date of Birth:</p>
                <p className='pl-[10px]'>{employee?.dateOfBirth}</p>
              </div>
            </div>

            <div className='pl-[40px] mb-[25px]'>
              <div className='border-l-2 border-[#105924] pl-[30px]'>
                <p className='font-bold text-[#105924]'>Start Date:</p>
                <p  className='pl-[10px]'>{employee?.startDate}</p>
              </div>
            </div>

            <div className='pl-[40px] mb-[25px]'>
              <div className='border-l-2 border-[#105924] pl-[30px]'>
                <p className='font-bold text-[#105924]'>Address:</p>
                <p className='pl-[20px]'>{employee?.street}</p>
                <p className='pl-[20px]'>{employee?.city}</p>
                <p className='pl-[20px]'>{employee?.state}</p>
                <p className='pl-[20px]'>{employee?.zipCode}</p>
              </div>
            </div>

            <div className='pl-[40px] mb-[25px]'>
              <div className='border-l-2 border-[#105924] pl-[30px]'>
                <p className='font-bold text-[#105924]'>Department:</p>
                <p className='pl-[20px]'>{employee?.department}</p>
              </div>
            </div>

            <div className='flex flex-col justify-center items-center mt-[30px]'>
              <button type="button" className='bg-[#105924] hover:bg-[#105924]/80 text-white font-bold rounded-[20px] px-[15px] py-[8px] mt-[25px] mb-[25px] cursor-pointer' onClick={() => setUpdating(true)/*navigate(`/update-employee/${employee?.id}`)*/}>
                Update
              </button>
              <button type="button" className='flex px-[10px] pb-[25px] font-bold text-[#105924] cursor-pointer' onClick={() => navigate('/')}>
                <svg className='inline-block' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#105924"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg> Back to the list of employees
              </button>
            </div>
          </div>
        </div>

        {updating && id && (
          <UpdateEmployee
            id={id}
            setUpdating={setUpdating}
          />
        )}
      </div>

      <div className='flex flex-col justify-center items-center text-center m-[20px]'>
        <button type="button" className='bg-[#B30000] hover:bg-[#B30000]-500/80 text-white font-bold rounded-[20px] px-[15px] py-[5px] cursor-pointer' onClick={() => setDisplayDeleteModal(true)}>
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