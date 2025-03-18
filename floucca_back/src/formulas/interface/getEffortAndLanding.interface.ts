export interface GetEffortAndLandingInterface {
    effort : {
        records: number,
        gears: number,
        activeDays: number,
        pba: number,
        estEffort: number
    },
    landings: {
        records: number,
        avgPrice: number,
        estValue: number,
        cpue: number,
        estCatch: number,
        sampleEffort: number
    }
}