export interface GetAllFleetInterface {
    fleet_senses_id: number;
    form_id: number;
    gear_usage?: {
        gear_code: number;
        months: number;
    }[];
}
