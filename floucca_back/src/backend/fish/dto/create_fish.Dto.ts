import { Decimal } from "@prisma/client/runtime/library";
import {IsDecimal, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive} from "class-validator";

export class CreateFishDto {
    @IsNotEmpty()
    @IsNumber()
    specie_code: number;
    @IsOptional()
    @IsNumber()
    landing_id: number;
    @IsNotEmpty()
    @IsNumber()
    gear_code: number;
    @IsDecimal()
    fish_weight?: number;
    @IsDecimal()
    fish_length?: number;
    @IsPositive()
    @IsInt()
    fish_quantity?: number
    @IsPositive()
    @IsDecimal()
    price:number
}