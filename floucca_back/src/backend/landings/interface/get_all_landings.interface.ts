import {Decimal} from "@prisma/client/runtime/library";

export interface GetAllLandingsInterface {
    landing_id: number;
    form_id: number;
    latitude: Decimal;
    longitude: Decimal;
}