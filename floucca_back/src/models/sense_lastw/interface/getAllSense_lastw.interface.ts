export interface GetAllSenseLastw {
    sense_lastw_id: number;  // edit to match Prisma schema
    days_fished: number;
    gear_code: number;
    landing_id: number;
    created_at?: Date;  // Prisma 
    updated_at?: Date;
}
