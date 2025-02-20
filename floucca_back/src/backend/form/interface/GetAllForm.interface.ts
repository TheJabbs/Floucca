export interface GetAllFormInterface {
    form_id: number,
    user_id: number,
    port_id: number,
    period_date: Date,
    fisher_name: string,
    creation_time: Date,
    landing?: {
        landing_id: number,
    }[],
    fleet_senses?: {
        fleet_senses_id: number,
    }[],
}
