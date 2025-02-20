import {IsInt, IsOptional, IsPositive} from "class-validator";

export class UpdateEffortDto{
    @IsOptional()
    @IsInt()
    @IsPositive()
    hours_fished?: number;
    @IsOptional()
    @IsInt()
    @IsPositive()
    landing_id?: number;
}