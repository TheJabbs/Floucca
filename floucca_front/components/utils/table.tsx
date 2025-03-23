import React from "react";

interface TableColumn {
  key: string;
  header: string;
  format?: (value: any) => string | number;
}

interface ReusableTableProps {
  title?: string;
  columns: TableColumn[];
  data: any[] | null;
  isLoading: boolean;
  noDataMessage?: string;
  keyExtractor?: (item: any) => string;
}

/**
 * Format a number as currency (LBP)
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Format a decimal number with 2 decimal places
 */
const formatDecimal = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const ReusableTable: React.FC<ReusableTableProps> = ({
  title,
  columns,
  data,
  isLoading,
  noDataMessage = "No data available",
  keyExtractor,
}) => {
  // Function to format cell values based on their content and column
  const formatCellValue = (column: TableColumn, value: any): string | number => {
    // If the column has a custom formatter, use it
    if (column.format) {
      return column.format(value);
    }

    // Apply general formatting based on value type and column name
    if (typeof value === 'number') {
      // Apply currency formatting for price or value columns
      if (column.key.toLowerCase().includes('price') || column.key.toLowerCase().includes('value')) {
        return formatCurrency(value);
      }
      
      // For decimal numbers, format with 2 decimal places
      if (value % 1 !== 0) {
        return formatDecimal(value);
      }
    }
    
    return value;
  };

  return (
    <div>
      {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : !data || data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                >
                  {noDataMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={keyExtractor ? keyExtractor(item) : index}>
                  {columns.map((column) => (
                    <td
                      key={`${index}-${column.key}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {formatCellValue(column, item[column.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReusableTable;