import { GetFilteredInterface } from "../../backend/landings/interface/getFiltered.interface";

export function mapLandingsMapMapper(landingsMap: Map<number, GetFilteredInterface[]>): Map<number, Map<number, number>> {
    const mapper = new Map<number, Map<number, number>>();

    for (const [port_id, landings] of landingsMap) {
        const fishMapper = new Map<number, number>();

        for (const landing of landings) {
            for (const fish of landing.fish) {
                fishMapper.set(fish.specie_code, (fishMapper.get(fish.specie_code) || 0) + fish.fish_weight);
            }
        }

        mapper.set(port_id, fishMapper);
    }

    return mapper;
}
