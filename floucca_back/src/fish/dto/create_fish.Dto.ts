import {IsNotEmpty, IsNumber} from "class-validator";

export class FishDto {
    @IsNotEmpty()
    @IsNumber()
    specie_code: number;
    @IsNotEmpty()
    @IsNumber()
    landing_id: number;
    @IsNotEmpty()
    @IsNumber()
    gear_code: number;
    fish_weight?: number;
    fish_length?: number;
    fish_quantity?: number
}