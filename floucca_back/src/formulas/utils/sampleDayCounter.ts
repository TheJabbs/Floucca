import {SamplingInterface} from "../../backend/gear/interface/sampling.interface";

export function sampleDayCounter(data : SamplingInterface[]) : number{
    const days = data.map(item => {
        return item.period.toISOString().split("T")[0]
    })
    const uniqueDays = new Set(days);
    return uniqueDays.size;
}