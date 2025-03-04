import {GetFilteredLastWInterface} from "../../backend/sense_lastw/interface/getFilteredLastW.interface";

export function mapEffortMapMapper(
    effortMap: Map<number, GetFilteredLastWInterface[]>
): Map<number, Map<number, { sumDaysFished: number; numberOfForms: number }>> {
    const mapper = new Map();

    for (const [port_id, efforts] of effortMap) {
        const effortMapper = new Map();

        for (const effort of efforts) {
            const existing = effortMapper.get(effort.gear_code) ?? { sumDaysFished: 0, numberOfForms: 0 };

            effortMapper.set(effort.gear_code, {
                sumDaysFished: existing.sumDaysFished + effort.days_fished,
                numberOfForms: existing.numberOfForms + 1,
            });
        }

        mapper.set(port_id, effortMapper);
    }

    return mapper;
}
