import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useEmployeeStore from '../../app/hooks/store';
import { Modal } from 'antd';

function Profile(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const [displayDeleteModal, setDisplayDeleteModal] = useState<boolean>(false);
  const employees = useEmployeeStore(state => state.employees);
  const employee = employees.find((employee) => employee.id === id);

  return (
    <div className='flex flex-col justify-center px-[100px] mx-auto'>
      
      <div className='flex justify-between'>
        <h2 className='flex-1 text-3xl text-center font-bold'>Employee Profile</h2>

        <button type="button" className='flex col px-[10px] py-[5px]' onClick={() => navigate('/')}>
          <svg className='inline-block' xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg> Back
        </button>
      </div>
      
      <div className='border border-black p-[20px] rounded-2xl'>
        <div>
          <div>
            <p className='font-bold'>First Name:</p>
            <p>{employee?.firstName}</p>
          </div>

          <div>
            <p className='font-bold'>Last Name:</p>
            <p>{employee?.lastName}</p>
          </div>

          <div>
            <p className='font-bold'>Date of Birth:</p>
            <p>{employee?.dateOfBirth}</p>
          </div>

          <div>
            <p className='font-bold'>Start Date:</p>
            <p>{employee?.startDate}</p>
          </div>

          <div>
            <p className='font-bold'>Address:</p>
            <p>{employee?.street}</p>
            <p>{employee?.city}</p>
            <p>{employee?.state}</p>
            <p>{employee?.zipCode}</p>
          </div>

          <div>
            <p className='font-bold'>Department:</p>
            <p>{employee?.department}</p>
          </div>
        </div>
      </div>

      <div className='flex flex-col justify-center'>
        <div className='flex justify-end'>
          <button type="button" className='bg-[#105924] hover:bg-[#105924]/80 text-white rounded-[8px] px-[10px] py-[5px]' onClick={() => navigate(`/update-employee/${employee?.id}`)}>
            Update
          </button>
        </div>

        <button type="button" className='bg-rose-500 hover:bg-rose-500/80 text-white rounded-[8px] px-[10px] py-[5px]' onClick={() => setDisplayDeleteModal(true)}>
          Delete
        </button>
      </div>

      {displayDeleteModal && (
        <Modal
          title="Delete Employee"
          open={displayDeleteModal}
          onOk={() => navigate(`/delete-employee/${employee?.id}`)}
          onCancel={() => setDisplayDeleteModal(false)}
        >
          <p>This action cannot be undone.</p>
          <p>Are you sure you want to delete this employee ? If yes, please type "DELETE {employee?.id} {employee?.startDate}"</p>
          <form >
            <input type="text" />
            <div>
              <button type="submit" className='bg-rose-500 hover:bg-rose-500/80 text-white rounded-[8px] px-[10px] py-[5px]'>Delete</button>
              <button type="button" className='bg-[#105924] hover:bg-[#105924]/80 text-white rounded-[8px] px-[10px] py-[5px]' onClick={() => setDisplayDeleteModal(false)}>Cancel</button>
            </div>
            
          </form>
          <div>

          </div>
        </Modal>
      )}
    </div>
  )
}

export default Profile;