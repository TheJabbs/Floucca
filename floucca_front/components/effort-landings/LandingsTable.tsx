import React from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

const landingsData = [
  { label: "Records", value: 23 },
  { label: "Sample Catch", value: "319.8" },
  { label: "Sample Effort", value: 23.0 },
  { label: "Aver Price", value: "6,058.47" },
  { label: "Est Value", value: "259,586,892" },
  { label: "CPUE", value: "13.90" },
  { label: "Est Catch", value: "42,847" },
  { label: "Spatial Accur.", value: 0.90 },
  { label: "Method for Accur.", value: "SPST" },
  { label: "N.days", value: 6 },
  { label: "Temp. Accur.", value: 0.88 },
  { label: "Method for Accur.", value: "SPST" },
  { label: "SUI", value: 0.67 },
  { label: "CV (%)", value: "37.8 %" },
];

const LandingsTable = () => {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden w-full bg-white mt-4">
      <TableHeader title="Landings" />
      <table className="w-full border-collapse">
        <tbody>
          {landingsData.map((item) => (
            <TableRow key={item.label} label={item.label} value={item.value} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LandingsTable;
