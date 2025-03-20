import React from "react";
import EffortLandings from "@/components/effort-landings/EffortLandings";

const EffortLandingsPage = () => {
  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl w-full">
        <EffortLandings />
      </div>
    </main>
  );
};

export default EffortLandingsPage;
