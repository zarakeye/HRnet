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
 * Component that renders a modal to confirm the deletion of an employee.
 * The modal prompts the user to type a specific text in order to confirm the deletion.
 * If the user does not type the correct text, the modal displays an error message and does not close.
 * If the user types the correct text, the component removes the employee from the store and displays a success message.
 * If the deletion is successful, the component navigates to the homepage.
 * @param id The id of the employee to delete.
 * @param displayDeleteModal A boolean that indicates whether the modal should be displayed or not.
 * @param setDisplayDeleteModal A function that sets the boolean value of displayDeleteModal.
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
   * Handles the submission of the deletion form.
   * Verifies if the input text matches the required deletion confirmation format.
   * Checks if the user has agreed to the irreversible deletion.
   * If the employee exists, deletes the employee from the store.
   * If the employee does not exist, sets an error state and displays an error message.
   * If the input is incorrect or the agreement checkbox is not checked, sets a bad input state.
   * @param values The form values containing the delete confirmation text and agreement checkbox.
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
   * Closes the result modal and resets the state of the DeleteEmployee component.
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