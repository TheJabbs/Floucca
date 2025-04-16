import React from "react";
import { Edit, Trash2, Check, X } from "lucide-react";

interface Role {
  id: number;
  name: string;
}

interface Coop {
  id: number;
  name: string;
}

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roles: Role[];
  coops: Coop[];
  lastLogin: string;
  creationTime: string;
}

interface UserTableProps {
  users: UserData[];
  onEdit: (userId: number) => void;
  onDelete: (userId: number) => void;
  showConfirmDelete: number | null;
  setShowConfirmDelete: (id: number | null) => void;
  formatDate: (date: string) => string;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
  showConfirmDelete,
  setShowConfirmDelete,
  formatDate,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Roles
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coops
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                  <div className="text-sm text-gray-500">{user.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <span
                        key={role.id}
                        className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                      >
                        {role.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {user.coops.map((coop) => (
                      <span
                        key={coop.id}
                        className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800"
                      >
                        {coop.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(user.lastLogin)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(user.creationTime)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  {showConfirmDelete === user.id ? (
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                        aria-label="Confirm delete"
                      >
                        <Check className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setShowConfirmDelete(null)}
                        className="text-gray-600 hover:text-gray-900"
                        aria-label="Cancel delete"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onEdit(user.id)}
                        className="text-blue-600 hover:text-blue-900"
                        aria-label="Edit user"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setShowConfirmDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                        aria-label="Delete user"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
