import { Decimal } from "@prisma/client/runtime/library";

export interface FishInterface{
    fish_id?: number,
    specie_code: number;
    landing_id?: number,
    gear_code?: number,
    fish_weight?: number,
    fish_length?: number,
    fish_quantity?: number
    price?:number
}