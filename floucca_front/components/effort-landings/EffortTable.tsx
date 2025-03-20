import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

const effortData = [
  { label: "Records", value: 24 },
  { label: "Boats/Gears", value: 100 },
  { label: "Active Days", value: 31.0 },
  { label: "PBA", value: 0.994 },
  { label: "Est Effort", value: "3,082" },
  { label: "Spatial Accur.", value: 0.93 },
  { label: "Method for Accur.", value: "SPST" },
  { label: "N.days", value: "-" },
  { label: "Temp. Accur.", value: 1.0 },
  { label: "Method for Accur.", value: 1.0 },
  { label: "SUI", value: 1.0 },
  { label: "CV (%)", value: "0.6 %" },
];

const EffortTable = () => {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden w-full bg-white">
      <TableHeader title="Effort (WEEKLY)" />
      <table className="w-full border-collapse">
        <tbody>
          {effortData.map((item) => (
            <TableRow key={item.label} label={item.label} value={item.value} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EffortTable;
