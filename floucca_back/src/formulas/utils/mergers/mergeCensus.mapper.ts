import {FleetReportInterface} from "../../../backend/fleet_senses/interface/fleetReport.interface";

export function mergeCensusMapper(input: FleetReportInterface[]): FleetReportInterface[] {
    const mergedMap = new Map<number, FleetReportInterface>();

    for (const item of input) {
        if (mergedMap.has(item.gear_code)) {
            const existing = mergedMap.get(item.gear_code)!;
            mergedMap.set(item.gear_code, {
                ...existing,
                freq: existing.freq + item.freq,
                activeDays: (existing.activeDays *existing.freq + item.activeDays * item.freq) / (existing.freq + item.freq),
            });
        } else {
            mergedMap.set(item.gear_code, { ...item });
        }
    }

    return Array.from(mergedMap.values());
}
