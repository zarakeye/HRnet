import type { Employee,  } from "../../common/types";
// import { lastUpdateResponseSchema } from "../../schemas/meta.schema";
import { useAuthStore } from "../../app/hooks/useAuthStore";

const API_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_API_URL_DEVELOPMENT
    : import.meta.env.VITE_API_URL_PRODUCTION;
console.log("mode: ", import.meta.env.MODE);
console.log("DEV_URL: ", import.meta.env.VITE_API_URL_DEVELOPMENT);
console.log("PROD_URL: ", import.meta.env.VITE_API_URL_PRODUCTION);
console.log("API_URL: ", API_URL);

/**
 * Fetches the list of employees from the API.
 * @returns A promise that resolves with an array of Employee objects.
 * @throws An error if the request fails.
 */
export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const { token } = useAuthStore.getState();

    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // cache: "no-store",
    });

    console.log(`Employees API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Employees API error: ${errorText}`);
      throw new Error(`Failed to fetch employees: ${response.statusText}`);
    }

    const employees = await response.json();
    console.log(`Employees data: ${JSON.stringify(employees)}`);
    return employees;
  } catch (error) {
    console.error(`Error in getEmployees: ${error}`);
    throw error;
  }
};

/**
 * Creates a new employee in the API.
 * @param employee An Employee object without an id
 * @returns A promise that resolves with the newly created Employee object
 * @throws An error if the request fails
 */
export const createEmployee = async (employee: Omit<Employee, "id">): Promise<Employee> => {
  try {
    const { token } = useAuthStore.getState();

    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_URL}/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(employee),
    });

    console.log(`response: ${response}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Create employee API error: ${errorText}`);
      throw new Error("Failed to create employee: " + response.statusText);
    }

    const newEmployee = await response.json();
    console.log(`New employee data: ${JSON.stringify(newEmployee)}`);
    return newEmployee;
  } catch (error) {
    console.error(`Error in createEmployee: ${error}`);
    throw error;
  }
}

export const updateEmployee = async (employee: Employee): Promise<Employee> => {
  const { id, ...rest } = employee;
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rest),
  });

  console.log(`response: ${response}`);

  if (!response.ok) {
    throw new Error("Failed to update employee");
  }

  return response.json();
}

export const deleteEmployee = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  console.log(`response: ${response}`);

  if (!response.ok) {
    throw new Error("Failed to delete employee");
  }
}

/**
 * Fetches the last update timestamp from the API.
 * The last update timestamp is returned as a Unix timestamp in milliseconds.
 * @returns A promise that resolves with the last update timestamp in milliseconds.
 * @throws An error if the request fails.
 */
export const getLastUpdateTimestamp = async (token: string): Promise<number> => {
  try {
    const response = await fetch(`${API_URL}/meta/last-update`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Last update response status: ${response.status}`);

    const constentType = response.headers.get('content-type');
    console.log(`Last update response content-type: ${constentType}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server error: ${errorText}`);
      throw new Error(`Failed to get last update timestamp: ${response.status} ${response.statusText}`);
    }

    if (!constentType || !constentType.startsWith('application/json')) {
      const text = await response.text();
      console.error(`Expected JSON but got: ${constentType}, response: ${text}`);
      throw new Error(`Server returned non-JSON response`);
    }

    const data = await response.json();
    // const parsedData = lastUpdateResponseSchema.parse(data);

    // if (!parsedData.success) {
    //   throw new Error(data.message || "Failed to get last update timestamp");
    // }

    // // Convertir le timestamp Unix en millisecondes
    // return data.timestampUnix;
    console.log(`Last update response data: ${data}`);
    
    if (data.success && data.timestampUnix) {
      return data.timestampUnix;
    } else {
      throw new Error(data.message || "Invalid response format");
    }
  } catch (error) {
    console.error(`Error in getLastUpdateTimestamp: ${error}`);
    throw error;
  }
}


