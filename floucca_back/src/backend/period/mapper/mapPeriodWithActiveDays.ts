import {GetAllPeriodInterface} from "../interface/get_all_period.interface";
import {GetAllActiveDaysInterface} from "../../active_days/interface/getAllActiveDays.interface";
import {GetPeriodWithActiveDaysInterface} from "../interface/getPeriodWithActiveDays.interface";

export function mapPeriodWithActiveDays(period: GetAllPeriodInterface[], activeDays: GetAllActiveDaysInterface[]) : GetPeriodWithActiveDaysInterface[]{
    return period.map((periodItem) => {
        const activeDaysForPeriod = activeDays.filter(activeDay => activeDay.period_date.toDateString() === periodItem.period_date.toDateString());
        return {
            period: periodItem,
            activeDays: activeDaysForPeriod
        };
    });
}