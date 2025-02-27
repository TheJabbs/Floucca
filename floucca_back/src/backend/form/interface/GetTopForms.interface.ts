export interface GetTopFormsInterface {
  form: {
    form_id: number;
    port_id: number;
    user_id: number;
    fisher_name: string;
    period_date?: Date;
    boat_detail?: number;
  };

  ports: {
    port_name: string;
  };

  boat_details: {
    fleet_owner: string;
    fleet_registration: number;
    fleet_size: number;
    fleet_crew: number;
    fleet_max_weight: number;
    fleet_length: number;
  };

  landing: {
    latitude: number;
    longitude: number;
  };

  fish: Array<{
    specie_code: number;
    gear_code: number;
    fish_weight: number;
    fish_length: number;
    fish_quantity: number;
  }>;

  effort: {
    hours_fished: number;
  };

  gearDetail: Array<{
    gear_code: number;
    detail_name: string;
    detail_value: string;
  }>;

  lastw: Array<{
    gear_code: number;
    days_fished: number;
  }>;
}
