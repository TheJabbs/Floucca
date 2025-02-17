import {ArrayNotEmpty, IsArray, IsInt, IsPositive} from "class-validator";

export class FormGearUsageDto{
    @IsInt()
    @IsPositive()
    gear_code: number;

    @IsArray()
    @ArrayNotEmpty()
    @IsInt({each: true})
    months: number [];
}