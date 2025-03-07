// import type { FormProps } from "antd";
// import { Button, Checkbox, Form, Input, Modal } from "antd";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import useEmployeeStore from "../../app/hooks/store";

// type FieldType = {
//   agree: boolean;
//   delete: string;
// };

// interface DeleteEmployeeProps {
//   id: string;
//   displayDeleteModal: boolean
//   setDisplayDeleteModal: React.Dispatch<React.SetStateAction<boolean>>
// }


// function DeleteEmployee({id, displayDeleteModal, setDisplayDeleteModal}: DeleteEmployeeProps): JSX.Element {
//   const navigate = useNavigate();
//   const employees = useEmployeeStore(state => state.employees);
//   const deleteEmployee = useEmployeeStore(state => state.removeEmployee);
//   const [openDeletionResultModal, setOpenDeletionResultModal] = useState<boolean>(false);
//   const [deletionResultMessage, setDeletionResultMessage] = useState<string>('');
//   const [deleting, setDeleting] = useState<boolean>(false);
//   const [deletionError, setDeletionError] = useState<boolean | null>(null);
//   const [badInput, setBadInput] = useState<boolean>(false);
//   const employee = employees.find((employee) => employee.id === id);
//   const [openDeleteFormModal, setOpenDeleteFormModal] = useState<boolean>(displayDeleteModal);
  
//   const handleSubmit: FormProps<FieldType>['onFinish'] = (values) => {
//     if (values.agree) {
//       if(values.delete === `DELETE ${employee?.id} ${employee?.startDate}`) {
//         if (employee) {
//           setDeleting(true);
//           deleteEmployee(employee.id);
//         } else {
//           setDeletionError(true);
//           setDeletionResultMessage('Employee not found');
//           setOpenDeletionResultModal(true);
//         }
//       } else {
//         setBadInput(true)
//       }
//     }
//   }
  
//   // const handleSuccessModalClick = () => {
//   //   if (!deletionError) {
//   //     navigate('/');
//   //   }
//   // }

//   const handleResultModalClose = () => {
//     setOpenDeletionResultModal(false); // Close the result modal
//     setDeleting(false); // Reset the deleting state
//     setOpenDeleteFormModal(false); // Close the confirmation modal
//     setBadInput(false);
//     setDeletionError(false); // Reset the error state

//     if (!deletionError) {
//       navigate("/"); // Navigate home if successful
//     }
//   };

//   useEffect(() => {
//     if (deleting) {
//       const isEmployeeStillInList = employees.some((storedEmployee) => storedEmployee.id === id);
    
//       if (!isEmployeeStillInList) {
//         setDeletionResultMessage('Employee deleted successfully !');
//         setOpenDeletionResultModal(true);
//         setDeletionError(false);
//       } else {
//         setDeletionResultMessage('Employee deletion failed !');
//         setOpenDeletionResultModal(true);
//         setDeletionError(true);
//       }
//     }    
//   }, [employees, deleting, id]);


//   return (
//     <div>
//       <Modal
//         title="Delete Employee"
//         centered
//         open={openDeleteFormModal}
//         footer={null}
//       >
//         <p className='text-red-500'>This action cannot be undone !!!</p>
//         <p className='text-red-500'>Are you sure you want to delete this employee ? If yes, please type "DELETE {employee?.id} {employee?.startDate}"</p>

//         <Form
//           layout='vertical'
//           onFinish={handleSubmit}
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
//             <Input
//               onChange={() => setBadInput(false)}
//             />
//           </Form.Item>

//           <p hidden={badInput === false } className='text-red-500'>The input is incorrect</p>

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
//       </Modal>

//       <Modal
//         open={openDeletionResultModal}
//         centered
//         footer={[
//           <Button
//             key="submit"
//             type="primary"
//             style={{ backgroundColor: 'oklch(0.577 0.245 27.325)' }}
//             onClick={handleResultModalClose}
//           >
//             OK
//           </Button>,
//         ]}
//         >
//         <p className='text-center'>{deletionResultMessage}</p>
//       </Modal>
//     </div>
//   )
// }

// export default DeleteEmployee;

// import type { FormProps } from "antd";
// import { Button, Checkbox, Form, Input, Modal } from "antd";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import useEmployeeStore from "../../app/hooks/store";

// type FieldType = {
//   agree: boolean;
//   delete: string;
// };

// interface DeleteEmployeeProps {
//   id: string;
//   displayDeleteModal: boolean;
//   setDisplayDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
// }

// function DeleteEmployee({
//   id,
//   displayDeleteModal,
//   setDisplayDeleteModal,
// }: DeleteEmployeeProps): JSX.Element {
//   const navigate = useNavigate();
//   const employees = useEmployeeStore((state) => state.employees);
//   const deleteEmployee = useEmployeeStore((state) => state.removeEmployee);
//   const [isDeleting, setIsDeleting] = useState<boolean>(false);
//   const [deletionResult, setDeletionResult] = useState<
//     "success" | "failure" | null
//   >(null);
//   const employee = employees.find((employee) => employee.id === id);
//   const [badInput, setBadInput] = useState<boolean>(false);

//   const handleConfirmDelete = (values: FieldType) => {
//     if (values.agree && values.delete === `DELETE ${employee?.id} ${employee?.startDate}`) {
//       setIsDeleting(true); // Deletion in progress
//     } else {
//         setBadInput(true);
//     }
//   };

//   useEffect(() => {
//     if (isDeleting) {
//         deleteEmployee(id);
//     }
//   }, [isDeleting]);

//   useEffect(() => {
//     if (isDeleting) {
//       const isEmployeeStillInList = employees.some(
//         (storedEmployee) => storedEmployee.id === id
//       );

//       if (!isEmployeeStillInList) {
//         setDeletionResult("success");
//       } else {
//         setDeletionResult("failure");
//       }
//     }
//   }, [employees, isDeleting, id]);

//   const handleCloseConfirmationModal = () => {
//     setDisplayDeleteModal(false);
//     setBadInput(false);
//   };

//   const handleCloseResultModal = () => {
//     setIsDeleting(false);
//     setDeletionResult(null);
//     setBadInput(false);
//     setDisplayDeleteModal(false)

//     if (deletionResult === "success") {
//       navigate("/");
//     }
//   };

//   return (
//     <div>
//       <Modal
//         title="Confirm Delete"
//         open={displayDeleteModal}
//         onCancel={handleCloseConfirmationModal}
//         footer={null}
//         centered
//       >
//         <p className="text-red-500">This action cannot be undone !!!</p>
//         <p className="text-red-500">
//           Are you sure you want to delete this employee ? If yes, please type
//           "DELETE {employee?.id} {employee?.startDate}"
//         </p>
//         <Form layout="vertical" onFinish={handleConfirmDelete}>
//           <Form.Item
//             name="delete"
//             rules={[
//               {
//                 required: true,
//                 message:
//                   'Please type "DELETE {employee?.id} {employee?.startDate} before submitting or cancel this action',
//               },
//             ]}
//           >
//             <Input onChange={() => setBadInput(false)} />
//           </Form.Item>

//           <p hidden={badInput === false} className="text-red-500">
//             The input is incorrect
//           </p>

//           <Form.Item<FieldType>
//             name="agree"
//             valuePropName="checked"
//             rules={[
//               {
//                 required: true,
//                 message: "Please agree to delete this employee",
//               },
//             ]}
//           >
//             <Checkbox>I understand this action cannot be undone</Checkbox>
//           </Form.Item>

//           <Form.Item<FieldType> label={null}>
//             <div className="flex justify-end">
//               <Button
//                 htmlType="submit"
//                 style={{
//                   backgroundColor: "red",
//                   color: "white",
//                   marginRight: "10px",
//                 }}
//               >
//                 Delete
//               </Button>

//               <Button
//                 htmlType="button"
//                 type="primary"
//                 onClick={handleCloseConfirmationModal}
//               >
//                 Cancel
//               </Button>
//             </div>
//           </Form.Item>
//         </Form>
//       </Modal>

//       <Modal
//         title={deletionResult === "success" ? "Success" : "Failure"}
//         open={deletionResult !== null}
//         onCancel={handleCloseResultModal}
//         footer={[
//           <Button
//             key="ok"
//             type="primary"
//             onClick={handleCloseResultModal}
//             style={{ backgroundColor: "oklch(0.577 0.245 27.325)" }}
//           >
//             OK
//           </Button>,
//         ]}
//         centered
//       >
//         {deletionResult === "success" ? (
//           <p>Employee deleted successfully !</p>
//         ) : (
//           <p>Employee deletion failed.</p>
//         )}
//       </Modal>
//     </div>
//   );
// }

// export default DeleteEmployee;
