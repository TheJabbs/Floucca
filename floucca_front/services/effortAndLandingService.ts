import axios from "axios";

export interface GeneralFilterDto {
  period: Date;
  gear_code?: number[]; 
  port_id?: number[];
  coop?: number[];
  region?: number[];
  specie_code?: number[];
}

export interface GetEffortAndLandingResponse {
  effort?: {
    records: number;
    gears: number;
    activeDays: number;
    pba: number;
    estEffort: number;
  };
  landings?: {
    records: number;
    avgPrice: number;
    estValue: number;
    cpue: number;
    estCatch: number;
    sampleEffort: number;
  };
}

export const fetchEffortAndLanding = async (filters: GeneralFilterDto) => {
  try {
    const formattedFilters = {
      period: filters.period ? new Date(filters.period).toISOString() : undefined,
      gear_code: filters.gear_code?.length ? filters.gear_code : undefined,
      port_id: filters.port_id?.length ? filters.port_id : undefined,
      coop: filters.coop?.length ? filters.coop : undefined,
      region: filters.region?.length ? filters.region : undefined,
      specie_code: filters.specie_code?.length ? filters.specie_code : undefined,
    };

    console.log("Sending request with filters:", formattedFilters);

    const response = await axios.post(
      "http://localhost:4000/api/dev/formulas/report/effort&landing",
      formattedFilters
    );

    console.log("API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching effort and landing data:", error);
    console.error("Error response data:", error.response?.data);
    console.error("Error response status:", error.response?.status);
    throw error;
  }
};
