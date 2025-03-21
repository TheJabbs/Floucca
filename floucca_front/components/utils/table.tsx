import React from "react";
import { Loader2 } from "lucide-react";

interface Column {
  key: string;
  header: string;
}

interface ReusableTableProps<T> {
  title: string;
  columns: Column[];
  data: T[] | null;
  isLoading: boolean;
  noDataMessage?: string;
  keyExtractor?: (item: T, index: number) => string | number;
}

function ReusableTable<T>({
  title,
  columns,
  data,
  isLoading,
  noDataMessage = "No data available.",
  keyExtractor = (_, index) => index,
}: ReusableTableProps<T>) {
  return (
    <div >
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <h2 className="text-lg font-medium mb-3">{title}</h2>
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data && data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={keyExtractor(item, index)}>
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-2 whitespace-nowrap">
                        {item[column.key as keyof T] !== undefined ? String(item[column.key as keyof T]) : '—'}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    {noDataMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ReusableTable;