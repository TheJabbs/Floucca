"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSpeciesMapper = mapSpeciesMapper;
function mapSpeciesMapper(species) {
    const speciesMap = new Map();
    species.forEach(specie => {
        specie.fish.forEach(fish => {
            if (speciesMap.has(fish.specie_code)) {
                speciesMap.set(fish.specie_code, [...speciesMap.get(fish.specie_code), specie]);
            }
            else {
                speciesMap.set(fish.specie_code, [specie]);
            }
        });
    });
    return speciesMap;
}
//# sourceMappingURL=mapSpecies.mapper.js.map