"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapLandingsMapForSpeciePriceMapper = mapLandingsMapForSpeciePriceMapper;
function mapLandingsMapForSpeciePriceMapper(landingsMap) {
    const mapper = new Map();
    for (const [port_id, landings] of landingsMap) {
        const fishMapper = new Map();
        for (const landing of landings) {
            for (const fish of landing.fish) {
                const existingEntry = fishMapper.get(fish.specie_code);
                if (existingEntry) {
                    existingEntry.fishTotalPrice += fish.price;
                    existingEntry.count++;
                }
                else {
                    fishMapper.set(fish.specie_code, { fishTotalPrice: fish.price, count: 1 });
                }
            }
        }
        mapper.set(port_id, fishMapper);
    }
    return mapper;
}
//# sourceMappingURL=mapLandingsMapForSpeciePrice.mapper.js.map