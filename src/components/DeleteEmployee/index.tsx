import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useEmployeeStore from "../../app/hooks/store";

type FieldType = {
  agree: boolean;
  delete: string;
};

interface DeleteEmployeeProps {
  id: string;
  displayDeleteModal: boolean
  setDisplayDeleteModal: React.Dispatch<React.SetStateAction<boolean>>
}


/**
 * Component that renders a modal to delete an employee from the store.
 * The modal renders a form with a single input field to input a specific text to confirm the deletion.
 * The form also renders a checkbox to confirm that the user understand that the deletion is irreversible.
 * If the input is correct, the employee is deleted from the store and the result modal is displayed with a success message.
 * If the input is incorrect, the result modal is displayed with an error message.
 * If the employee is not found in the store, the result modal is displayed with an error message.
 * The component uses the useEmployeeStore hook to fetch the employees from the store and the deleteEmployee function to delete the employee.
 * The component uses the useState hook to track the state of the deleting modal and the result modal.
 * The component uses the useEffect hook to track the state of the deleting modal and display the result modal accordingly.
 * The component uses the navigate hook to navigate to the homepage if the deletion is successful.
 * @param id The id of the employee to delete.
 * @param displayDeleteModal The boolean state of the delete modal.
 * @param setDisplayDeleteModal The function to set the state of the delete modal.
 * @returns The JSX element of the DeleteEmployee component.
 */
function DeleteEmployee({id, displayDeleteModal, setDisplayDeleteModal}: DeleteEmployeeProps): JSX.Element {
  const navigate = useNavigate();
  const employees = useEmployeeStore(state => state.employees);
  const deleteEmployee = useEmployeeStore(state => state.removeEmployee);
  const [openDeletionResultModal, setOpenDeletionResultModal] = useState<boolean>(false);
  const [deletionResultMessage, setDeletionResultMessage] = useState<string>('');
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deletionError, setDeletionError] = useState<boolean | null>(null);
  const [badInput, setBadInput] = useState<boolean>(false);
  const employee = employees.find((employee) => employee.id === id);
  
  /**
   * Handles the form submission for deleting an employee.
   * Checks if the input text matches the expected deletion phrase and whether the user agrees with the irreversible action.
   * If the input is correct and the agreement checkbox is checked, the function proceeds to delete the employee from the store.
   * Displays result modals with error messages if the employee is not found or if the input is incorrect.
   * Sets the deleting state to true when deletion is in process, and updates the bad input state when input validation fails.
   * 
   * @param values - The form field values containing the delete phrase and agreement checkbox state.
   */
  const handleSubmit: FormProps<FieldType>['onFinish'] = (values) => {
    if (values.delete === `DELETE ${employee?.id} ${employee?.startDate}`) {
      if (values.agree) {
        if (employee) {
          setDeleting(true);
          deleteEmployee(employee.id);
        } else {
          setDeletionError(true);
          setDeletionResultMessage('Employee not found');
          setOpenDeletionResultModal(true);
        }
      } else {
        setBadInput(true);
      }
    } else {
      setBadInput(true);
    }
  }

  /**
   * Handles the close event of the result modal.
   * Resets the deleting state and the input validation state.
   * Resets the error state.
   * If the deletion was successful, navigates to the homepage.
   */
  const handleResultModalClose = () => {
    setOpenDeletionResultModal(false); // Close the result modal
    setDeleting(false); // Reset the deleting state
    setBadInput(false);
    setDeletionError(false); // Reset the error state

    if (!deletionError) {
      navigate("/"); // Navigate home if successful
    }
  };

  useEffect(() => {
    if (deleting) {
      const isEmployeeStillInList = employees.some((storedEmployee) => storedEmployee.id === id);
    
      if (!isEmployeeStillInList) {
        setDeletionResultMessage('Employee deleted successfully !');
        setOpenDeletionResultModal(true);
        setDeletionError(false);
      } else {
        setDeletionResultMessage('Employee deletion failed !');
        setOpenDeletionResultModal(true);
        setDeletionError(true);
      }
    }    
  }, [employees, deleting, id]);

  return (
    <div>
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
          onFinish={handleSubmit}
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
              onBlur={(e) => {
                if (e.target.value.trim() !== `DELETE ${employee?.id} ${employee?.startDate}`) {
                  setBadInput(true);
                }
              }}
            />
          </Form.Item>

          <p key={badInput? 'badInput' : 'goodInput'} hidden={badInput === false } className='text-red-500'>The input is incorrect</p>

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
            onClick={handleResultModalClose}
          >
            OK
          </Button>,
        ]}
        >
        <p className='text-center'>{deletionResultMessage}</p>
      </Modal>
    </div>
  )
}

export default DeleteEmployee;