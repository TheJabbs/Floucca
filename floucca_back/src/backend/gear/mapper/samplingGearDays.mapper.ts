import {SamplingInterface} from "../interface/sampling.interface";

export function samplingGearDaysMapper(input): SamplingInterface[]{
    return input.map((item) => {
        return {
            gear_code: item.gear_code,
            time: item.landing.form.creation_time
        }
    })
}