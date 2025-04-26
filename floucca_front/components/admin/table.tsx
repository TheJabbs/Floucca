import React from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface ReusableDataTableProps<T extends object> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  error?: string | null;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  deleteConfirmId?: string | number | null;
  setDeleteConfirmId?: (id: string | number | null) => void;
  noDataMessage?: string;
}

function ReusableDataTable<T extends object>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  error = null,
  onEdit,
  onDelete,
  deleteConfirmId,
  setDeleteConfirmId,
  noDataMessage = "No data found"
}: ReusableDataTableProps<T>) {
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        {noDataMessage}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key.toString()} 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => {
              const itemId = keyExtractor(item);
              return (
                <tr key={itemId} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td 
                      key={`${itemId}-${column.key.toString()}`} 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {column.render 
                        ? column.render(column.key in item ? item[column.key as keyof T] : undefined, item)
                        : column.key in item ? String(item[column.key as keyof T]) : ''}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      {deleteConfirmId === itemId ? (
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => onDelete && onDelete(item)}
                            className="text-red-600 hover:text-red-900"
                            aria-label="Confirm delete"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId && setDeleteConfirmId(null)}
                            className="text-gray-600 hover:text-gray-900"
                            aria-label="Cancel delete"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(item)}
                              className="text-blue-600 hover:text-blue-900"
                              aria-label="Edit item"
                            >
                              <Pencil className="h-5 w-5" />
                            </button>
                          )}
                          {onDelete && setDeleteConfirmId && (
                            <button
                              onClick={() => setDeleteConfirmId(itemId)}
                              className="text-red-600 hover:text-red-900"
                              aria-label="Delete item"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReusableDataTable;