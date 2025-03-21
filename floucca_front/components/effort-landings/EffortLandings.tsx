"use client";

import { useEffect, useState } from "react";
import {
  fetchEffortAndLanding,
  GetEffortAndLandingResponse,
  GeneralFilterDto,
} from "@/services/effortAndLandingService";
import EffortTable from "./EffortTable";
import LandingsTable from "./LandingsTable";

const EffortLandings = () => {
  const [data, setData] = useState<GetEffortAndLandingResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {

        const filters: GeneralFilterDto = {
          period: new Date("2024-01-01"), 
          gear_code: [1, 2],
          port_id: [10],
          coop: [5],
          region: [2],
          specie_code: [20],
        };

        console.log("Sending Filters:", filters);
        console.log("Type of period:", typeof filters.period, filters.period);

        const response = await fetchEffortAndLanding(filters);
        setData(response);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <h2>Effort & Landing Data</h2>
      <EffortTable effort={data?.effort} />
      <LandingsTable landings={data?.landings} />
    </div>
  );
};

export default EffortLandings;
