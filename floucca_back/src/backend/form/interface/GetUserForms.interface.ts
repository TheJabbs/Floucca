export interface GetUserFormsInterface {
    form_id: number;
    user_id: number;
    port_id: number;
    period_date: Date;
    fisher_name: string;
    creation_time: Date;
    ports: { port_name: string };
    boat_details: {
      boat_id: number;
      fleet_owner: string;
      fleet_size: number;
      fleet_crew: number;
      fleet_max_weight: number;
      fleet_length: number;
      fleet_registration: number;
    };
  }
  