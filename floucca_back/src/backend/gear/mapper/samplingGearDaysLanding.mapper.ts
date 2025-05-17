import {SamplingInterface} from "../interface/sampling.interface";

interface InputInterface {
    gear_code: number,
    landing: {
        form: {
            creation_time: Date,
        }
    }
}


export function samplingLanding(input: InputInterface[]): SamplingInterface[] {
    return input.map((item) => {
        return {
            gear_code: item.gear_code,
            period: item.landing.form.creation_time
        }
    })
}