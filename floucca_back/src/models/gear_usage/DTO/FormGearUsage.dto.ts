import {IsArray, IsInt, IsPositive} from "class-validator";

export class FormGearUsageDto{
    @IsInt()
    @IsPositive()
    gear_code: number;

    @IsInt({each: true})
    months: number [];
}