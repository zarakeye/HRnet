import type { Employee } from "../common/types"



/**
 * Checks if any of the fields in the `formData` object are empty.
 * If any fields are empty, they are added to the `emptyFields` array.
 * The `emptyFields` array is then returned.
 * @param formData The object containing the employee data to be checked.
 * @returns An array of the keys of the empty fields.
 */
export function checkEmptyFields(formData: Employee, ): Array<keyof Employee> {
  const emptyFields: Array<keyof Employee> = [];
  
  for (const key in formData) {
    if (formData[key as keyof Employee] === '') {
      emptyFields.push(key as keyof Employee);
    }
  }

  return emptyFields
}

/**
 * Checks if the given employee form data is submittable.
 * Validates that all required fields are filled and the zip code is not null.
 * 
 * @param formData The employee form data to validate.
 * @returns True if all required fields are filled, false otherwise.
 */

export function isSubmittableFormData(formData: Employee): boolean {
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

/**
 * Returns true if the given string contains only letters and/or spaces.
 * Used to validate the first name, last name, street and city form inputs.
 * 
 * @param value The string to validate.
 * @returns True if the string contains only letters and/or spaces, false otherwise.
 */
export function isOnlyLetters(value: string): boolean {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ-\s]*$/.test(value);
}

/**
 * Returns true if the given string contains only letters, numbers, spaces, or any of the following characters: -,
 * Used to validate the department form input.
 * 
 * @param value The string to validate.
 * @returns True if the string contains only letters, numbers, spaces, or any of the above characters, false otherwise.
 */
export function isOnlyAlphanumeric(value: string): boolean {
  return /^[A-Za-zÀ-ÖØ-öø-ÿ0-9,-\s]*$/.test(value);
}

/**
 * Returns true if the given string represents a valid 5-digit US zip code.
 *
 * @param value The string to validate.
 * @returns True if the string represents a valid 5-digit US zip code, false otherwise.
 */
export function isValidZipCode(value: string): boolean {
  return /^[0-9]{5}$/.test(value);
}

/**
 * Returns true if the given string contains only 0 to 5 digits, and represents a zip code that is still being entered.
 *
 * @param value The string to validate.
 * @returns True if the string contains only 0 to 5 digits and represents a zip code that is still being entered, false otherwise.
 */
export function isZipCodeUnderConstruction(value: string): boolean {
  return /^[0-9]{0,5}$/.test(value);
}

/**
 * Sanitizes a string by replacing any of the following characters with their corresponding HTML escape sequences:
 * & < > " ' ` = / \
 * This is useful for preventing XSS attacks.
 *
 * @param str The string to sanitize.
 * @returns The sanitized string.
 */
export function sanitize (str: string): string {
  return str.replace(/&<>"'`=\/\\]/g, s => {
    return "&#" + s.charCodeAt(0) + ';';
  });
}

/**
 * Returns true if the given string contains any non-digit characters.
 *
 * @param value The string to test.
 * @returns True if the string contains any non-digit characters, false otherwise.
 */
export const isNotOnlyDigits = (value: string): boolean => {
  return !/^\d*$/.test(value);
};

