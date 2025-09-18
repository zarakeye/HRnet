import { ReactNode } from "react";

/**
 * Converts a date string into a formatted JSX span element.
 * The date is formatted as 'DD/MM/YYYY', where days and months are zero-padded if necessary.
 * @param dateString A string representation of a date.
 * @returns A ReactNode containing the formatted date.
 */
function renderDate(dateString: string):ReactNode {
  const date = new Date(dateString);
  
  return (
    <span>{date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/{(date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}/{date.getFullYear()}</span>
  )
}

export default renderDate;