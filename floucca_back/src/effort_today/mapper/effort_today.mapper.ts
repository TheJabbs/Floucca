import {EffortTodayDto} from "../dto/effort_today.Dto";
import {CreateEffortTodayInterface} from "../interface/create_update_effort_today.interface";

export function mapEffortToday(effort: EffortTodayDto) : CreateEffortTodayInterface{
    return {
        hours_fished: effort.hours_fished,
        detail_id: effort.detail_id,
        landing_id: effort.landing_id
    }
}