import React from "react";

const TableHeader = ({ title }: { title: string }) => {
  return (
    <div className="bg-gray-200 p-2 font-bold text-lg text-center rounded-t-lg">
      {title}
    </div>
  );
};

export default TableHeader;
