import axios from 'axios';

interface FishStat {
  period_date: string; 
  specie_name: string;
  quantity: number;
}

interface GeneralFilterDto {
  period: string; //ISO 
  port_id?: number[];
  coop?: number[];
  region?: number[];
  gear_code?: number[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const fishService = {
  async getFishStats(filter: GeneralFilterDto): Promise<FishStat[]> {
    try {
      const response = await axios.post(`${API_URL}/stats/avg`, filter);
      return response.data;
    } catch (error) {
      console.error('Error fetching fish stats:', error);
      return [];
    }
  }
};
