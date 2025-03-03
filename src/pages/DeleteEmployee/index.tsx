import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Employee } from "../../common/types";
import useEmployeeStore from "../../app/hooks/store";

function DeleteEmployee() {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const employees = useEmployeeStore(state => state.employees);
  const deleteEmployee = useEmployeeStore(state => state.removeEmployee);
  const [formData, setFormData] = useState<string>('') 
  // const [delete, setDelete] = useState<boolean>(false);
  const [displayConfirm, setDisplayConfirm] = useState<boolean>(false);
  const [inputError, setInputError] = useState<string | null>(null);
  
  const employeeToDelete = employees.find((employee: Employee) => employee.id === id);
  const dateOfStart = new Date(employeeToDelete?.startDate || '');
  const dayOfStart = dateOfStart.getDate();
  const monthOfStart = dateOfStart.getMonth() + 1;
  const yearOfStart = dateOfStart.getFullYear();
  const formattedDateOfStart = `${yearOfStart}-${monthOfStart < 10 ? `0${monthOfStart}` : monthOfStart}-${dayOfStart < 10 ? `0${dayOfStart}` : dayOfStart}`

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (id && formData === `DELETE ${employeeToDelete?.id} ${formattedDateOfStart}`) {
      setDisplayConfirm(true);
      setInputError(null)
      // navigate('/');
    } else {
      setInputError('* This input is not correct to delete this employee !');
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div>
        <p>
          Id :<br/>
          {employeeToDelete?.id}
        </p>
        <p>
          First name :<br/>
          {employeeToDelete?.firstName}
        </p>
        <p>
          Last name :<br/>
          {employeeToDelete?.lastName}
        </p>
        <p>
          Date of birth :<br/>
          {employeeToDelete?.dateOfBirth}
        </p>
        <p>
          Date of start :<br/>
          {employeeToDelete?.startDate}
        </p>
        <p>
          Street :<br/>
          {employeeToDelete?.street}
        </p>
        <p>
          City :<br/>
          {employeeToDelete?.city}
        </p>
        <p>
          State :<br/>
          {employeeToDelete?.state}
        </p>
        <p>
          Zip code :<br/>
          {employeeToDelete?.zipCode}
        </p>
        <p>
          Departement :<br/>
          {employeeToDelete?.department}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <fieldset className="border-[1px] border-black p-[20px] rounded-[10px]">
          <legend className="px-[5px]">Delete</legend>
          <p>If you are absolutely sure about the employee to delete, enter <span className="inline-block font-bold bg-red-600/60 text-white px-[10px] py-[5px] rounded-[10px]">DELETE idOfTheEmplyee dateOfStart</span> while respecting yyyy-mm-dd for the date: </p>
          <input
            type="text"
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              setFormData(e.currentTarget.value)
            }}
            className='w-[300px] border-[1px] border-black rounded-[5px]'
          />
          {inputError && (
            <p className="text-red-600">{inputError}</p>
          )}
        </fieldset>
        <button
          type="submit"
          className="bg-red-700 text-white font-bold py-2 px-4 mt-[20px] rounded-[10px]"
        >
          Delete
        </button>
      </form>

      {displayConfirm && (
        <>
          <p>Are you sure you want to delete this employee ?</p>
          <div>
            <button
              type="button"
              onClick={() => {
                deleteEmployee(id as string);
                navigate('/');
              }}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => {
                setDisplayConfirm(false);
              }}
            >
              No
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default DeleteEmployee;