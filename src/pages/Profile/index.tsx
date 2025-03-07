import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useEmployeeStore from '../../app/hooks/store';
import { DatePicker, Modal, Form, Button, Input, Checkbox } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { FormProps } from 'antd';
import { USStates, type Employee } from '../../common/types';
import sanitize from '../../tools/sanitize';
import validateEmployeeFormData from '../../tools/validateEmployeeFormData';

type FieldType = {
  agree: boolean;
  delete: string;
};

function Profile(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const [displayDeleteModal, setDisplayDeleteModal] = useState<boolean>(false);
  const employees = useEmployeeStore(state => state.employees);
  const deleteEmployee = useEmployeeStore(state => state.removeEmployee);
  const updateEmployee = useEmployeeStore(state => state.updateEmployee);
  const employee = employees.find((employee) => employee.id === id);
  const [badInput, setBadInput] = useState<boolean>(false);
  const [deletionError, setDeletionError] = useState<boolean | null>(null);
  const [deletionResultMessage, setDeletionResultMessage] = useState<string>('');
  const [openDeletionResultModal, setOpenDeletionResultModal] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [updateSubmitting, setUpdateSubmitting] = useState<boolean>(false);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);
  const [formData, setFormData] = useState<Employee>({
    id: employee?.id || '',
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    dateOfBirth: employee?.dateOfBirth || '',
    startDate: employee?.startDate || '',
    street: employee?.street || '',
    city: employee?.city || '',
    state: employee?.state || '',
    zipCode: String(employee?.zipCode) || '',
    department: employee?.department || ''
  });

  const handleDeleteFormSubmit: FormProps<FieldType>['onFinish'] = (values) => {
    if (values.agree) {
      if(values.delete === `DELETE ${employee?.id} ${employee?.startDate}`) {
        if (employee) {
          setDeleting(true);
          deleteEmployee(employee.id);
        } else {
          setDeletionError(true);
          setDeletionResultMessage('Employee not found');
          setOpenDeletionResultModal(true);
        }
      } else {
        setBadInput(true)
      }
    }
  }

  const handleDeletionResultModalClick = () => {
    if (!deletionError) {
      navigate('/');
    } else {
      setOpenDeletionResultModal(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement > | Dayjs | string | null, dateId?: keyof Employee) => {
      setUpdateSubmitting(false)
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

  const handleUpdateSubmit = (e: React.FormEvent<HTMLFormElement>, formData: Employee) => {
    e.preventDefault();
    setUpdateSubmitting(true);
    setUpdating(true);
    const updatedEmployee: Employee = {
      id: employee?.id || '',
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
      setUpdateSubmitting(false);
    }
    
  } 
    

  useEffect(() => {
    if (deleting) {
      const isEmployeeStillInList = employees.some((storedEmployee) => storedEmployee.id === id);
    
      if (!isEmployeeStillInList) {
        setDeletionResultMessage('Employee deleted successfully !');
        setOpenDeletionResultModal(true);
        setDeletionError(false);
        setDeleting(false);
      } else {
        setDeletionResultMessage('Employee deletion failed !');
        setOpenDeletionResultModal(true);
        setDeletionError(true);
        setDeleting(false);
      }
    }    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, id]);


  return (
    <main className='flex flex-col justify-center mt-[250px] mb-[100px]'>
      <div className='bg-[#105924]/20 rounded-[40px] w-[500px] mt-[25px]'>
        <div hidden={updating} >
          <div>
            <h2 className='flex-1 text-3xl bg-[#105924] text-center text-white font-bold p-[40px] rounded-t-[40px]'><span className='sr-only'>Profile of </span>{employee?.firstName} {employee?.lastName.toUpperCase()}</h2>

            <div className='pl-[40px] mt-[25px] mb-[25px]'>
              <div className='border-l-2 border-[#105924] pl-[30px]'>
                <p className='font-bold text-[#105924]'>Identifier:</p>
                <p className='pl-[10px]'>{employee?.id}</p>
              </div>
            </div>

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

        <div hidden={!updating} className='flex flex-col items-center justify-center'>
          <form 
            onSubmit={e => handleUpdateSubmit(e, formData)}
          >
            <div className='my-2 w-auto h-[105px] pt-[25px]'>
              <div className={`text-red-600 ${(updateSubmitting && emptyFields.includes('firstName')) ? '' : 'hidden'}`}>
                The <span className='font-bold'>First name</span> field is required !
              </div>

              <label htmlFor="first-name" className='block font-bold text-[#105924]'>First Name</label>
              <input
                type="text"
                id="first-name"
                placeholder="John"
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                required
                className='block border-2 border-[#105924] bg-white rounded-[5px] pl-[5px]'
                defaultValue={formData?.firstName}
              />
            </div>
            
            <div className='my-1.5 h-[80px]'>
              <div className={`text-red-600 ${(updateSubmitting && emptyFields.includes('lastName'))  ? '' : 'hidden'}`}>
                The <span className='font-bold'>Last name</span> field is required !
              </div>

              <label htmlFor="last-name" className='block font-bold text-[#105924]'>Last Name</label>
              <input
                type="text"
                id="last-name"
                placeholder="Doe"
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                required
                className='block border-2 border-[#105924] bg-white rounded-[5px] pl-[5px]'
                defaultValue={formData?.lastName}
              />
            </div>

            <div className='my-1.5 h-[80px]'>
              <div className={`text-red-600 ${updateSubmitting && emptyFields.includes('dateOfBirth') ? 'block' : 'hidden'}`}>
                The <span className='font-bold'>Date of birth</span> field is required !
              </div>

              <label htmlFor="date-of-birth" className='block font-bold text-[#105924]'>Date of Birth</label>
              <DatePicker
                name='date-of-birth'
                inputReadOnly= {true}
                defaultValue={dayjs(formData?.dateOfBirth)}
                format='MM/DD/YYYY'
                onChange={e => handleChange(e, 'dateOfBirth')}
                maxDate={dayjs().subtract(18, 'year')}
                style={{border: '2px solid #105924', borderRadius: '5px', padding: '5px'}}
              />
            </div>

            <div className='my-1.5 h-[80px]'>
              <div className={`text-red-600 ${updateSubmitting && emptyFields.includes('startDate') ? 'block' : 'hidden'}`}>
                The <span className='font-bold'>Date of beginning</span> field is required !
              </div>

              <label htmlFor="start-date" className='block font-bold text-[#105924]'>Start Date</label>
              <DatePicker
                id="startDate"
                name='start-date'
                inputReadOnly= {true}
                defaultValue={dayjs(formData?.startDate)}
                format='MM/DD/YYYY'
                onChange={e => handleChange(e, 'startDate')}
                maxDate={dayjs()}
                style={{border: '2px solid #105924', borderRadius: '5px', padding: '5px'}}
              />
            </div>

            <fieldset className="border-2 border-[#105924] rounded-[5px] pb-[10px] mb-[25px]">
              <legend className="ml-[10px] p-[5px] font-bold text-[#105924]">Address</legend>

              <div className='ml-[10px] my-1.5 h-[80px]'>
                <div className={`text-red-600 ${updateSubmitting && emptyFields.includes('street') ? 'block' : 'hidden'}`}>
                  The <span className='font-bold'>Street</span> field is required !
                </div>

                <label htmlFor="street" className='block font-bold text-[#105924]'>Street</label>
                <input
                  id="street"
                  type="text"
                  onChange={handleChange}
                  className='block border-2 border-[#105924] bg-white rounded-[5px] pl-[5px]'
                  defaultValue={formData?.street}
                />
              </div>

              <div className='ml-[10px] my-1.5 h-[80px]'>
                <div className={`text-red-600 ${updateSubmitting && emptyFields.includes('city') ? 'block' : 'hidden'}`}>
                  The <span className='font-bold'>City</span> field is required !
                </div>

                <label htmlFor="city" className='block font-bold text-[#105924]'>City</label>
                <input
                  id="city"
                  type="text"
                  onChange={handleChange}
                  className='block border-2 border-[#105924] bg-white rounded-[5px] pl-[5px]'
                  defaultValue={formData?.city}
                />
              </div>

              <div className='ml-[10px] my-1.5 mr-[10px] h-[80px]'>
                <div className={`text-red-600 ${updateSubmitting && emptyFields.includes('state') ? '' : 'hidden'}`}>
                  The <span className='font-bold'>State</span> field is required !
                </div>

                <label htmlFor="state" className='block font-bold text-[#105924]'>State</label>
                <select
                  id="state"
                  onChange={handleChange}
                  className='block border-2 border-[#105924] bg-white rounded-[5px] pl-[5px]'
                  defaultValue={formData?.state}
                >
                {Object.values(USStates).map((state: string, index: number) => (
                  <option key={index} value={state}>{state}</option>
                ))}
                </select>
              </div>

              <div className='ml-[10px] my-1.5 h-[80px]'>
                <label htmlFor="zip-code" className='block font-bold text-[#105924]'>Zip Code</label>
                <input
                  id="zip-code"
                  type="number"
                  onChange={(e) => {
                    const value = isNaN(parseInt(e.target.value)) ? 0 : e.target.value
                    setFormData(prev => ({...prev, zipCode: String(value)}))
                  }}
                  className='block border-2 border-[#105924] bg-white rounded-[5px] pl-[5px]'
                  defaultValue={String(formData?.zipCode)}
                />
              </div>
            </fieldset>

            <div className='my-1.5 h-[80px]'>
              <div key={emptyFields.indexOf('department')} className={`text-red-600 ${updateSubmitting && emptyFields.includes('department') ? 'block' : 'hidden'}`}>
                The <span className='font-bold'>Department</span> field is required !
              </div>

              <label htmlFor="department" className='block font-bold text-[#105924]'>Department</label>
              <select
                id="department"
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className='block border-2 border-[#105924] bg-white rounded-[5px] pl-[5px]'
                required
                defaultValue={formData?.department}
              >
                <option disabled value="">Select a department</option>
                <option value="Sales">Sales</option>
                <option value="Engineering">Engineering</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Legal">Legal</option>
              </select>
            </div>

            <div className='flex mt-[20px] mb-[20px] gap-1.5 justify-center'>
              <button
                type='submit'
                className='bg-emerald-700 text-white font-bold rounded-[20px] px-[15px] py-[5px]'
              >
                Update
              </button>
              
              <button
                type='reset'
                className='bg-emerald-700 text-white rounded-[20px] px-[15px] py-[5px]'
                onClick={() => setUpdating(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className='flex flex-col justify-center items-center text-center m-[20px]'>
        <button type="button" className='bg-[#B30000] hover:bg-[#B30000]-500/80 text-white font-bold rounded-[20px] px-[15px] py-[5px] cursor-pointer' onClick={() => setDisplayDeleteModal(true)}>
          Delete
        </button>
      </div>

      <Modal
        title="Delete Employee"
        centered
        open={displayDeleteModal}
        footer={null}
      >
        <p className='text-red-500'>This action cannot be undone !!!</p>
        <p className='text-red-500'>Are you sure you want to delete this employee ? If yes, please type "DELETE {employee?.id} {employee?.startDate}"</p>

        <Form
          layout='vertical'
          onFinish={handleDeleteFormSubmit}
        >
          <Form.Item
            name="delete"
            rules={[
              {
                required: true,
                message: 'Please type "DELETE {employee?.id} {employee?.startDate} before submitting or cancel this action',
              },
            ]}
          >
            <Input
              onChange={() => setBadInput(false)}
            />
          </Form.Item>

          <p hidden={badInput === false } className='text-red-500'>The input is incorrect</p>

          <Form.Item<FieldType>
            name="agree"
            valuePropName="checked"
            rules={[
              {
                required: true,
                message: 'Please agree to delete this employee',
              },
            ]}
          >
            <Checkbox>
              I understand this action cannot be undone
            </Checkbox>
          </Form.Item>

          <Form.Item<FieldType> label={null}>
            <div className='flex justify-end'>
              <Button
                htmlType="submit"
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                  marginRight: '10px',
                }}
              >
                Delete
              </Button>

              <Button
                htmlType="button"
                type="primary"
                onClick={() =>  setDisplayDeleteModal(false)}
              >
                Cancel
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={openDeletionResultModal}
        centered
        footer={[
          <Button
            key="submit"
            type="primary"
            style={{ backgroundColor: 'oklch(0.577 0.245 27.325)' }}
            onClick={handleDeletionResultModalClick}
          >
            OK
          </Button>,
        ]}
      >
        <p className='text-center'>{deletionResultMessage}</p>
      </Modal>
    </main>
  )
}

export default Profile;