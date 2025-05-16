export interface WorkLoadStatisticInterface {
    gearName: string,
    gearUnit: number,
    landing: {
        samplingDays: number,
        samplingDaysMin: number,
        samples: number,
        samplesMin: number
    }
    effort:{
        samples: number,
        samplesMin: number
    }

}