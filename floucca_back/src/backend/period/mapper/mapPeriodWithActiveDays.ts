import {GetAllPeriodInterface} from "../interface/get_all_period.interface";
import {GetAllActiveDaysInterface} from "../../active_days/interface/getAllActiveDays.interface";

export function mapPeriodWithActiveDays(period: GetAllPeriodInterface[], activeDays: GetAllActiveDaysInterface[]) : Map<GetAllPeriodInterface, GetAllActiveDaysInterface[]>{
    const map = new Map<GetAllPeriodInterface, GetAllActiveDaysInterface[]>();

    console.log(`Total periods: ${period.length}`);
    console.log(`Total active days: ${activeDays.length}`);

    period.forEach((p) => {
        const activeDaysForPeriod = activeDays.filter((ad) => ad.period_date.getTime() === p.period_date.getTime());
        map.set(p, activeDaysForPeriod);

        console.log(`Period: ${p.period_date}, Active Days: ${activeDaysForPeriod.length}`);
    });

    return map;
}