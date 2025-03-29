import { GetFilteredInterface } from "../../backend/landings/interface/get_filtered.interface";

export function mapLandingsMapForSpeciePriceMapper(
    landingsMap: Map<number, GetFilteredInterface[]>
): Map<number, Map<number, { fishTotalPrice: number; count: number }>> {
    const mapper = new Map<number, Map<number, { fishTotalPrice: number; count: number }>>();

    for (const [port_id, landings] of landingsMap) {
        const fishMapper = new Map<number, { fishTotalPrice: number; count: number }>();

        for (const landing of landings) {
            for (const fish of landing.fish) {
                const existingEntry = fishMapper.get(fish.specie_code);

                if (existingEntry) {
                    existingEntry.fishTotalPrice += fish.price;
                    existingEntry.count++;
                } else {
                    fishMapper.set(fish.specie_code, { fishTotalPrice: fish.price, count: 1 });
                }
            }
        }

        mapper.set(port_id, fishMapper);
    }

    return mapper;
}
