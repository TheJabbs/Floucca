"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapLandingsMapForSpecieCountMapper = mapLandingsMapForSpecieCountMapper;
function mapLandingsMapForSpecieCountMapper(landingsMap) {
    const mapper = new Map();
    for (const [port_id, landings] of landingsMap) {
        const fishMapper = new Map();
        for (const landing of landings) {
            for (const fish of landing.fish) {
                fishMapper.set(fish.specie_code, (fishMapper.get(fish.specie_code) || 0) + fish.fish_weight);
            }
        }
        mapper.set(port_id, fishMapper);
    }
    return mapper;
}
//# sourceMappingURL=map_landings_map_for_specie_count.mapper.js.map