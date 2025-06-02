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
    @IsPositive()
    @IsNumber()
    gear_code: number;
    @IsNumber()
    fish_weight?: number;
    @IsPositive()
    @IsNumber()
    fish_length?: number;
    @IsPositive()
    @IsNumber()
    fish_quantity?: number
    @IsPositive()
    @IsNumber()
    price:number
}