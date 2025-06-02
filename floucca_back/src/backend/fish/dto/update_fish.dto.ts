import {IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive} from "class-validator";

export class UpdateFishDto {
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    specie_code?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    landing_id?: number;

    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    gear_code?: number;

    @IsOptional()
    @IsDecimal()
    fish_weight?: number;

    @IsOptional()
    @IsDecimal()
    fish_length?: number;

    @IsOptional()
    @IsPositive()
    @IsNumber()
    fish_quantity?: number

    @IsOptional()
    @IsPositive()
    @IsDecimal()
    price: number
}