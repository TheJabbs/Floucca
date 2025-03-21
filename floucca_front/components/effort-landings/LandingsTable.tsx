import React from "react";

interface LandingsProps {
  landings?: {
    records: number;
    avgPrice: number;
    estValue: number;
    cpue: number;
    estCatch: number;
    sampleEffort: number;
  };
}

const LandingsTable: React.FC<LandingsProps> = ({ landings }) => {
  if (!landings) return <p>No landings data available.</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Records</th>
          <th>Average Price</th>
          <th>Estimated Value</th>
          <th>CPUE</th>
          <th>Estimated Catch</th>
          <th>Sample Effort</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{landings.records ?? "N/A"}</td>
          <td>{landings.avgPrice ?? "N/A"}</td>
          <td>{landings.estValue ?? "N/A"}</td>
          <td>{landings.cpue ?? "N/A"}</td>
          <td>{landings.estCatch ?? "N/A"}</td>
          <td>{landings.sampleEffort ?? "N/A"}</td>
        </tr>
      </tbody>
    </table>
  );
};

export default LandingsTable;
