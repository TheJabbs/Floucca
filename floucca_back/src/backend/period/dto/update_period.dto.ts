import {IsEnum, Length} from "class-validator";
import {Transform} from "class-transformer";

export class UpdatePeriodDto{
    @IsEnum(['B', 'R', 'H'])
    @Length(1, 1)
    @Transform(({ value }) => value.toUpperCase())
    period_status : string
}