import {UpdatePeriodDto} from "./update_period.dto";
import {UpdateActiveDaysDto} from "../../active_days/dto/updateActiveDays.dto";
import {ValidateNested} from "class-validator";

export class UpdatePeriodAndActiveDaysDto{
    modifiedPeriod: {
        period: UpdatePeriodDto;
        period_date: Date;
    }

    modifiedActiveDays: {
        activeDays: UpdateActiveDaysDto;
        activeDays_id: number;
    }[]
}