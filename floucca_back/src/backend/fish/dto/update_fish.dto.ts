import {IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive} from "class-validator";

export class UpdateFishDto {
    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    specie_code?: number;
    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    landing_id?: number;
    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    gear_code?: number;
    @IsDecimal()
    @IsOptional()
    fish_weight?: number;
    @IsDecimal()
    @IsOptional()
    fish_length?: number;
    @IsPositive()
    @IsInt()
    @IsOptional()
    fish_quantity?: number
}