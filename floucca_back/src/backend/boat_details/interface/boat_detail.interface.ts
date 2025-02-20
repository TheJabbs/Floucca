export interface GetAllBoatDetailsInterface {
  boat_id: number;
  fleet_owner: string;
  fleet_size?: number;
  fleet_crew?: number;
  fleet_max_weight?: number;
  fleet_length?: number;
  fleet_registration?: number;
  fleet_senses: { fleet_senses_id: number }[];
  landing: { landing_id: number }[];
}
