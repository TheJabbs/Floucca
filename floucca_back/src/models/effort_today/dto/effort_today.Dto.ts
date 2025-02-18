import {IsInt, IsNotEmpty, Max, Min} from "class-validator";

export class EffortTodayDto {
    @IsNotEmpty()
    @Min(0)
    @Max(24)
    hours_fished: number;
    @IsNotEmpty()
    @IsInt()
    landing_id: number;
}