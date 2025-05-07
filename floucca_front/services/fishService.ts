import axios from 'axios';

interface FishStat {
  period_date: string;
  specie_name: string;
  quantity: number;
}

interface GeneralFilterDto {
  period: string;
  port_id?: number[];
  coop?: number[];
  region?: number[];
  gear_code?: number[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const fishService = {
  async getFishStats(filter: GeneralFilterDto): Promise<FishStat[]> {
    try {
      const response = await axios.post(`${API_URL}/api/fish/stats/avg`, filter);
      const rawData = response.data;

      const parsedData: FishStat[] = [];

      for (const periodDate in rawData) {
        const entries = rawData[periodDate];
        for (const key in entries) {
          const entry = entries[key];
          parsedData.push({
            period_date: periodDate,
            specie_name: entry.specie_name,
            quantity: entry.avg_quantity,
          });
        }
      }

      console.log('Parsed fish stats:', parsedData);
      return parsedData;
    } catch (error) {
      console.error('Error fetching fish stats:', error);
      return [];
    }
  }
};
