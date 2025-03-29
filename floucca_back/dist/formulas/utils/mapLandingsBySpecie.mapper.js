"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapLandingsBySpecieMapper = mapLandingsBySpecieMapper;
function mapLandingsBySpecieMapper(landings) {
    const landingsBySpecie = new Map();
    landings.forEach(landing => {
        landing.fish.forEach(fish => {
            if (landingsBySpecie.has(fish.specie_code)) {
                landingsBySpecie.set(fish.specie_code, landingsBySpecie.get(fish.specie_code) + 1);
            }
            else {
                landingsBySpecie.set(fish.specie_code, 1);
            }
        });
    });
    return landingsBySpecie;
}
//# sourceMappingURL=mapLandingsBySpecie.mapper.js.map