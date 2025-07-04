import type { Employee } from "../../common/types";

const API_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_DEVELOPMENT
    : import.meta.env.VITE_API_URL_PRODUCTION;
console.log("mode: ", import.meta.env.MODE);
console.log("DEV_URL: ", import.meta.env.VITE_API_URL_DEVELOPMENT);
console.log("PROD_URL: ", import.meta.env.VITE_API_URL_PRODUCTION);
console.log("API_URL: ", API_URL);

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await fetch(`${API_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }
  
  const employees: Employee[] = await response.json();
  console.log(employees);
  
  return employees;
};

export const createEmployee = async (employee: Omit<Employee, "id">): Promise<Employee> => {
  const response = await fetch(`${API_URL}/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });

  if (!response.ok) {
    throw new Error("Failed to create employee");
  }

  return response.json();
}

export const updateEmployee = async (employee: Employee): Promise<Employee> => {
  const response = await fetch(`${API_URL}/patch/${employee.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });

  if (!response.ok) {
    throw new Error("Failed to update employee");
  }

  return response.json();
}

export const deleteEmployee = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/delete/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete employee");
  }
}


