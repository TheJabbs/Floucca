import {IsNumber, IsOptional, IsPositive, Max, Min} from "class-validator";

export class UpdateGearUsageDto{
    @IsNumber()
    @IsPositive()
    @IsOptional()
    fleet_senses_id: number;
    @IsNumber()
    @IsPositive()
    @IsOptional()
    gear_code: number;
    @IsNumber()
    @IsPositive()
    @IsOptional()
    @Min(1)
    @Max(12)
    months: number;
}