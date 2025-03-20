import React from "react";
import EffortTable from "./EffortTable";
import LandingsTable from "./LandingsTable";

const EffortLandings = () => {
  return (
    <div className="space-y-6">
      <EffortTable />
      <LandingsTable />
    </div>
  );
};

export default EffortLandings;
