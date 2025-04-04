export function censusCounter(fleetCensus: any){
    let totalGears = 0;
    for (const element of fleetCensus) {
        const map = new Map<string, number>(Object.entries(element.months));
        for (const [key, value] of map) {
            totalGears += value;
        }
    }
    return totalGears;
}