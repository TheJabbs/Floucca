import axios from "axios";


export interface EffortData {
  records: number;
  gears: number;
  activeDays: number;
  pba: number;
  estEffort: number;
}

export interface LandingsData {
  records: number;
  avgPrice: number;
  estValue: number;
  cpue: number;
  estCatch: number;
  sampleEffort: number;
}

export interface EffortAndLandingResponse {
  effort: EffortData;
  landings: LandingsData;
}

export interface GeneralFilterDto {
  period: string;
  gear_code?: number[];
  port_id?: number[];
  coop?: number[];
  region?: number[];
  specie_code?: number[];
}

export const fetchEffortAndLanding = async (filter: GeneralFilterDto): Promise<EffortAndLandingResponse | null> => {
  try {
    const response = await axios.post<EffortAndLandingResponse>(
        "http://localhost:4000/api/dev/formulas/report/effort&landing",
        filter
      );
    return response.data;
  } catch (error) {
    console.error("Error fetching effort and landing data:", error);
    return null;
  }
};
