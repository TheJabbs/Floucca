import {IsInt, IsNotEmpty, IsOptional, Max, Min} from "class-validator";

export class CreateEffortTodayDto {
    @IsNotEmpty()
    @Min(0)
    @Max(24)
    hours_fished: number;
    @IsOptional()
    @IsInt()
    landing_id?: number;
}