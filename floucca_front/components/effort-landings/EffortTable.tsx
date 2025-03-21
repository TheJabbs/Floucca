import React from "react";

interface EffortProps {
  effort?: {
    records: number;
    gears: number;
    activeDays: number;
    pba: number;
    estEffort: number;
  };
}

const EffortTable: React.FC<EffortProps> = ({ effort }) => {
  if (!effort) return <p>No effort data available.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Records</th>
          <th>Gears</th>
          <th>Active Days</th>
          <th>PBA</th>
          <th>Estimated Effort</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{effort.records ?? "N/A"}</td>
          <td>{effort.gears ?? "N/A"}</td>
          <td>{effort.activeDays ?? "N/A"}</td>
          <td>{effort.pba ?? "N/A"}</td>
          <td>{effort.estEffort ?? "N/A"}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default EffortTable;
