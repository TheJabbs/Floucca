import {GetAllPeriodInterface} from "./get_all_period.interface";
import {GetAllActiveDaysInterface} from "../../active_days/interface/getAllActiveDays.interface";

export interface GetPeriodWithActiveDaysInterface{
    period: GetAllPeriodInterface,
    activeDays: GetAllActiveDaysInterface[]
}