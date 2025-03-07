import type { Employee } from "../common/types"

function validateFormData(formData: Employee): boolean {
  return formData.firstName.length > 0
    && formData.lastName.length > 0
    && formData.dateOfBirth.length > 0
    && formData.startDate.length > 0
    && formData.street.length > 0
    && formData.city.length > 0
    && formData.state.length > 0
    && formData.zipCode !== null
    && formData.department.length > 0
}

export default validateFormData;