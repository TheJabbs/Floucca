import React from "react";

interface TableRowProps {
  label: string;
  value: string | number;
}

const TableRow: React.FC<TableRowProps> = ({ label, value }) => {
  return (
    <tr className="border-b border-gray-200">
      <td className="p-3 text-left font-medium">{label}</td>
      <td className="p-3 text-right text-blue-600">{value}</td>
    </tr>
  );
};

export default TableRow;
