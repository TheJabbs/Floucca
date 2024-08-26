import {IsNotEmpty, Max, Min} from "class-validator";

export class EffortTodayDto {
    @IsNotEmpty()
    @Min(0)
    @Max(24)
    hours_fished: number;
    @IsNotEmpty()
    detail_id: number;
    @IsNotEmpty()
    landing_id: number;
}