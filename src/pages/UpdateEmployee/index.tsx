// import React, { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Employee, USStates } from '../../common/types';
// import useEmployeeStore from '../../app/hooks/store';
// import { DatePicker, Modal, Button, Form, Input, Checkbox } from 'antd';
// import dayjs from 'dayjs';
// import type { Dayjs } from 'dayjs';

// function UpdateEmployee (): JSX.Element {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const employees = useEmployeeStore(state => state.employees);
//   const row = employees.find((employee) => employee.id === id);
//   const updateEmployee = useEmployeeStore(state => state.updateEmployee);
//   const deleteEmployee = useEmployeeStore(state => state.removeEmployee);
//   const [displayDeleteModal, setDisplayDeleteModal] = useState<boolean | null>(null);
//   const [submitting, setSubmitting] = useState<boolean>(false);
//   const [emptyFields, setEmptyFields] = useState<Array<keyof Employee>>([]);

//   const [formData, setFormData] = useState<Employee>({
//     id: row?.id || '',
//     firstName: row?.firstName || '',
//     lastName: row?.lastName || '',
//     dateOfBirth: row?.dateOfBirth || '',
//     startDate: row?.startDate || '',
//     street: row?.street || '',
//     city: row?.city || '',
//     state: row?.state || '',
//     zipCode: row?.zipCode || '',
//     department: row?.department || ''
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement > | Dayjs | string | null, dateId?: keyof Employee) => {
//     setSubmitting(false)
//     let targetId: keyof Employee;
//     let targetValue: string | number | null;

//     if (dateId) {
//       targetId = dateId;
//       targetValue = (e as Dayjs)?.format('YYYY-MM-DD') || '';
//     } else {
//       targetId = (e as React.ChangeEvent<HTMLInputElement>).target.id as keyof Employee;
//       targetValue = (e as React.ChangeEvent<HTMLInputElement>).target.value;
//     }

//     setFormData(prev => ({...prev, [targetId]: targetValue}))

//     if (emptyFields.includes(targetId)) {
//       setEmptyFields(prev => prev.filter(field => field !== targetId))
//     }
//   }

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()

//     if (formData.firstName && formData.lastName && formData.dateOfBirth && formData.startDate && formData.street && formData.city && formData.state && formData.zipCode && !isNaN(parseInt(formData.zipCode)) && formData.department && formData.department !== '') {
//       const newEmployee: Employee = {
//         id: row?.id || '',
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         dateOfBirth: formData.dateOfBirth,
//         startDate: formData.startDate,
//         street: formData.street,
//         city: formData.city,
//         state: formData.state,
//         zipCode: formData.zipCode,
//         department: formData.department
//       };

//       updateEmployee(newEmployee);
//     } else {
//       alert('Please fill in all fields');
//     }
//   }

//   return (
//     <div className='flex flex-col items-center justify-center'>
//       <p>id : {row?.id}</p>
//       <form 
//         onSubmit={(e) => {
//           handleSubmit(e)
//         }}
//       >
//         <div className='my-2 w-auto h-[80px]'>
//           <div className={`text-red-600 ${(!submitting && emptyFields.includes('firstName')) ? '' : 'hidden'}`}>
//             The <span className='font-bold'>First name</span> field is required !
//           </div>

//           <label htmlFor="first-name" className='block font-bold'>First Name</label>
//           <input
//             type="text"
//             id="first-name"
//             placeholder="John"
//             onChange={e => setFormData({ ...formData, firstName: e.target.value })}
//             required
//             className='block border-2 border-zinc-500 rounded-[5px] pl-[5px]'
//             defaultValue={row?.firstName}
//           />
//         </div>
        
//         <div className='my-1.5 h-[80px]'>
//           <div className={`text-red-600 ${(!submitting && emptyFields.includes('lastName'))  ? '' : 'hidden'}`}>
//             The <span className='font-bold'>Last name</span> field is required !
//           </div>

//           <label htmlFor="last-name" className='block font-bold'>Last Name</label>
//           <input
//             type="text"
//             id="last-name"
//             placeholder="Doe"
//             onChange={e => setFormData({ ...formData, lastName: e.target.value })}
//             required
//             className='block border-2 border-gray rounded-[5px] pl-[5px]'
//             defaultValue={row?.lastName}
//           />
//         </div>

//         <div className='my-1.5 h-[80px]'>
//           <div className={`text-red-600 ${!submitting && emptyFields.includes('dateOfBirth') ? 'block' : 'hidden'}`}>
//             The <span className='font-bold'>Date of birth</span> field is required !
//           </div>

//           <label htmlFor="date-of-birth" className='block font-bold'>Date of Birth</label>
//           <DatePicker
//             name='date-of-birth'
//             inputReadOnly= {true}
//             defaultValue={dayjs(row?.dateOfBirth)}
//             format='MM/DD/YYYY'
//             onChange={e => handleChange(e, 'dateOfBirth')}
//             maxDate={dayjs().subtract(18, 'year')}
//             style={{border: '2px solid #52525c', borderRadius: '5px', padding: '5px'}}
//           />
//         </div>

//         <div className='my-1.5 h-[80px]'>
//           <div className={`text-red-600 ${!submitting && emptyFields.includes('startDate') ? 'block' : 'hidden'}`}>
//             The <span className='font-bold'>Date of beginning</span> field is required !
//           </div>

//           <label htmlFor="start-date" className='block font-bold'>Start Date</label>
//           <DatePicker
//             id="startDate"
//             name='start-date'
//             inputReadOnly= {true}
//             defaultValue={dayjs(row?.startDate)}
//             format='MM/DD/YYYY'
//             onChange={e => handleChange(e, 'startDate')}
//             maxDate={dayjs()}
//             style={{border: '2px solid #52525c', borderRadius: '5px', padding: '5px'}}
//           />
//         </div>

//         <fieldset className="border-2 border-gray rounded-[5px] pb-[10px]">
//           <legend className="ml-[10px] p-[5px] font-bold">Address</legend>

//           <div className='ml-[10px] my-1.5 h-[80px]'>
//             <div className={`text-red-600 ${!submitting && emptyFields.includes('street') ? 'block' : 'hidden'}`}>
//               The <span className='font-bold'>Street</span> field is required !
//             </div>

//             <label htmlFor="street" className='block font-bold'>Street</label>
//             <input
//               id="street"
//               type="text"
//               onChange={handleChange}
//               className='block border-2 border-gray rounded-[5px] pl-[5px]'
//               defaultValue={row?.street}
//             />
//           </div>

//           <div className='ml-[10px] my-1.5 h-[80px]'>
//             <div className={`text-red-600 ${!submitting && emptyFields.includes('city') ? 'block' : 'hidden'}`}>
//               The <span className='font-bold'>City</span> field is required !
//             </div>

//             <label htmlFor="city" className='block font-bold'>City</label>
//             <input
//               id="city"
//               type="text"
//               onChange={handleChange}
//               className='block border-2 border-gray rounded-[5px] pl-[5px]'
//               defaultValue={row?.city}
//             />
//           </div>

//           <div className='ml-[10px] my-1.5 mr-[10px] h-[80px]'>
//             <div className={`text-red-600 ${!submitting && emptyFields.includes('state') ? '' : 'hidden'}`}>
//               The <span className='font-bold'>State</span> field is required !
//             </div>

//             <label htmlFor="state" className='block font-bold'>State</label>
//             <select
//               id="state"
//               onChange={handleChange}
//               className='block border-2 border-gray rounded-[5px] pl-[5px]'
//               defaultValue={row?.state}
//             >
//             {Object.values(USStates).map((state: string, index: number) => (
//               <option key={index} value={state}>{state}</option>
//             ))}
//             </select>
//           </div>

//           <div className='ml-[10px] my-1.5 h-[80px]'>
//             <label htmlFor="zip-code" className='block font-bold'>Zip Code</label>
//             <input
//               id="zip-code"
//               type="number"
//               onChange={(e) => {
//                 const value = isNaN(parseInt(e.target.value)) ? 0 : e.target.value
//                 setFormData(prev => ({...prev, zipCode: String(value)}))
//               }}
//               className='block border-2 border-gray rounded-[5px] pl-[5px]'
//               defaultValue={String(row?.zipCode)}
//             />
//           </div>
//         </fieldset>

//         <div className='my-1.5 h-[80px]'>
//           <div key={emptyFields.indexOf('department')} className={`text-red-600 ${!submitting && emptyFields.includes('department') ? 'block' : 'hidden'}`}>
//             The <span className='font-bold'>Department</span> field is required !
//           </div>

//           <label htmlFor="department" className='block font-bold'>Department</label>
//           <select
//             id="department"
//             onChange={e => setFormData({ ...formData, department: e.target.value })}
//             className='block border-2 border-gray rounded-[5px] pl-[5px]'
//             required
//             defaultValue={row?.department}
//           >
//             <option disabled value="">Select a department</option>
//             <option value="Sales">Sales</option>
//             <option value="Engineering">Engineering</option>
//             <option value="Human Resources">Human Resources</option>
//             <option value="Legal">Legal</option>
//           </select>
//         </div>

//         <div className='flex mt-[20px] mb-[20px] gap-1.5 justify-center'>
//           <button
//             type='submit'
//             className='bg-emerald-700 text-white rounded-[8px] px-[10px] py-[5px]'
//           >
//             Update
//           </button>
          
//           <button
//             type='reset'
//             className='bg-emerald-700 text-white rounded-[8px] p-1.5'
//             onClick={() => navigate(`/profile/${row?.id}`)}
//           >
//             Cancel
//           </button>
//         </div>
//       </form>

//       <button
//         type='button'
//         onClick={() => setDisplayDeleteModal(true)}
//         className='bg-red-700 text-white rounded-[8px] px-[10px] py-[5px]'
//       >
//         Delete Employee
//       </button>

//       {/* <Modal
//         title="Delete Employee"
//         centered
//         open={displayDeleteModal}
//         footer={null}
//       >
//         <p className='text-red-500'>This action cannot be undone !!!</p>
//         <p className='text-red-500'>Are you sure you want to delete this employee ? If yes, please type "DELETE {employee?.id} {employee?.startDate}"</p>

//         <Form
//           layout='vertical'
//           onFinish={handleDeleteFormSubmit}
//         >
//           <Form.Item
//             name="delete"
//             rules={[
//               {
//                 required: true,
//                 message: 'Please type "DELETE {employee?.id} {employee?.startDate} before submitting or cancel this action',
//               },
//             ]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item<FieldType>
//             name="agree"
//             valuePropName="checked"
//             rules={[
//               {
//                 required: true,
//                 message: 'Please agree to delete this employee',
//               },
//             ]}
//           >
//             <Checkbox>
//               I understand this action cannot be undone
//             </Checkbox>
//           </Form.Item>

//           <Form.Item<FieldType> label={null}>
//             <div className='flex justify-end'>
//               <Button
//                 htmlType="submit"
//                 style={{
//                   backgroundColor: 'red',
//                   color: 'white',
//                   marginRight: '10px',
//                 }}
//               >
//                 Delete
//               </Button>

//               <Button
//                 htmlType="button"
//                 type="primary"
//                 onClick={() =>  setDisplayDeleteModal(false)}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </Form.Item>
//         </Form>
//       </Modal> */}

//       {/* {displayDeleteInput && ( */}
//         {/* <div
//           hidden={displayDeleteInput}
//           // onClose={() => setDisplayDeleteInput(false)}
//           className='flex flex-col items-center justify-center'
//         >
//           <p>{`To delete this employee, type "DELETE {employee id}" below:`}</p>
//           <input
//             type="text"
//             onChange={(e) => {
//               if (e.target.value === `DELETE ${row?.id}`) {
//                 deleteEmployee(row?.id || '');
//               }
//             }}
//             className='block border-2 border-gray rounded-[5px] pl-[5px]'
//           />
//         </div> */}
//       {/* )} */}
//     </div>
//   )
// }

// export default UpdateEmployee