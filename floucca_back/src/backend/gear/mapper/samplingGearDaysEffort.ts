import {SamplingInterface} from "../interface/sampling.interface";

interface InputInterface {
    gear_code: number,
    form: { creation_time: Date }
}


export function samplingEffort(input: InputInterface[]): SamplingInterface[] {
    return input.map((item) => {
        return {
            gear_code: item.gear_code,
            period: item.form.creation_time
        }
    })
}