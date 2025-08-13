import React, { memo, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Column } from 'react-ts-tab-lib';
import { Table } from 'react-ts-tab-lib';
import { Employee } from '../common/types';

const EmployeeTable = memo(({ employees }: { employees: Employee[] }) => {
  const navigate = useNavigate();

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

  const columns: Column<Employee>[] = [
    {
      property: 'firstName',
      displayName: 'First Name',
      type: 'string'
    },
    {
      property: 'lastName',
      displayName: 'Last Name',
      type: 'string',
      render: (value: string | number | null) => value && String(value).toUpperCase()
    },
    {
      property: 'dateOfBirth',
      displayName: 'Birth date',
      type: 'date',
      render: (value: string | number | null) => value && renderDate(String(value))
    },
    {
      property: 'startDate',
      displayName: 'Start date',
      type: 'date',
      render: (value: string | number | null) =>  value && renderDate(String(value))
    },
    {
      property: 'street',
      displayName: 'Street',
      type: 'string',
    },
    {
      property: 'city',
      displayName: 'City',
      type: 'string'
    },
    {
      property: 'state',
      displayName: 'State',
      type: 'string'
    },
    {
      property: 'zipCode',
      displayName: 'Zip Code',
      type: 'number'
    },
    {
      property: 'department',
      displayName: 'Department',
      type: 'string'
    }
  ];

  return (
    <Table
      key={employees.length}
      columns={columns}
      rows={employees}
      onRowClick={
        (row: Employee | null) => {
          if (!row) return;
          navigate(`/profile/${row?.id}`);
        }}
        defaultOrder={{
          property: 'lastName',
          order: 'asc'
        }}
        textContent={{
          searchPlaceholder: "Search...",
          sampleLabelPrefix: 'Affiche ',
          sampleLabelSuffix: ' employés par page',
          emptyTableText: 'Aucun employé',
          rangeInfoText: {
            showEntries_altText: 'Affichage des employés ',
            to_altText: ' à ',
            of_altText: ' sur ',
            entries_altText: ''
          },
          previousPageButtonLabel: 'Page précédente',
          nextPageButtonLabel: 'Page suivante'
        }}
        styleClassNames={{
          tableBorders: 'border-2 border-gray-300',
          tablePaddings: 'pt-[5px] pb-[15px] px-[5px]',
          tableHeaders: {
            borderY: 'border-y-2',
            borderColor: 'border-gray-300',
            borderL: 'border-l-2',
            borderR: 'border-r-2',
            roundedL: 'rounded-tl-[25px] rounded-bl-[25px]',
            roundedR: 'rounded-tr-[25px] rounded-br-[25px]',
            backgroundColor: 'bg-gray-800 hover:bg-gray-600 hover:shadow-[0_0_7px_0px_#7f7fbe]',
            padding: 'py-[5px]',
            margin: 'mb-[10px]',
          },
          rangeOptionsAndSearchBarArea: 'lg:flex-row',
          rangeLengthOptions: {
            buttonBackgroundColor: 'bg-gray-800 hover:bg-gray-600 hover:shadow-[0_0_7px_1px_#7f7fbe]',
            buttonBorder: 'border-2',
            buttonBorderColor: 'border-gray-300',
            buttonPadding: 'px-[20px] py-[5px]',
          },
          searchBar: {
            label: "sr-only",
            inputBorder: " border-2",
            inputBorderColor: "border-gray-300 hover:border-gray-400",
            inputFocusOutLine: "focus:outline-none",
            inputPadding: "py-[5px] px-[10px]",
            inputMarginL: "lg:ml-[10px]",
            inputBackgroundColor: "bg-gray-300 hover:shadow-[0_0_7px_1px_#7f7fbe]",
            inputRounded: "rounded-[20px]",

          },
          rows: {
            oddRowBackgroundColor: 'bg-gray-500 hover:bg-gray-700',
            evenRowBackgroundColor: 'bg-gray-600 hover:bg-gray-700',
            paddingX: 'px-[15px]',
            paddingT: 'pt-0',
            textColor: 'text-white hover:text-black',
          }
      }}
    />
  );
}, (prevProps, nextProps) => {
  // Ne re-rend que si la longueur ou les IDs changent
  return (
    prevProps.employees.length === nextProps.employees.length &&
    prevProps.employees.every((employee, index) => employee.id === nextProps.employees[index].id)
  )
});

export default EmployeeTable;