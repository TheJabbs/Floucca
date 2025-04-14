import {Transform} from "class-transformer";

export class UpdatePeriodDto{
    @Transform(({ value }) => value.toUpperCase())
    period_status : string
}