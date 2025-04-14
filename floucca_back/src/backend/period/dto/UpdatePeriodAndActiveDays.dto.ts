import {UpdatePeriodDto} from "./update_period.dto";
import {UpdateActiveDaysDto} from "../../active_days/dto/updateActiveDays.dto";
import {ValidateNested} from "class-validator";

export class UpdatePeriodAndActiveDaysDto{
    @ValidateNested({each: true})
    modifiedPeriod: {
        period: UpdatePeriodDto;
        period_date: Date;
    }[]

    @ValidateNested({each: true})
    modifiedActiveDays: {
        activeDays: UpdateActiveDaysDto;
        activeDays_id: number;
    }[]
}