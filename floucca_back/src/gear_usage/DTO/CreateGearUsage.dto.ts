import {IsNumber, IsOptional, IsPositive, Max, Min} from "class-validator";

export class CreateGearUsageDto{
    @IsNumber()
    @IsPositive()
    fleet_senses_id: number;
    @IsNumber()
    @IsPositive()
    gear_code: number;
    @IsNumber()
    @IsPositive()
    @Min(1)
    @Max(12)
    months: number;
}