import { FishInterface } from "../../backend/fish/interface/fish.interface";
import { GetFilteredInterface } from "../../backend/landings/interface/get_filtered.interface";

export function mapSpeciesMapper(species: GetFilteredInterface[]): Map<number, GetFilteredInterface[]> {
    const speciesMap = new Map<number, GetFilteredInterface[]>();
    species.forEach(specie => {
        specie.fish.forEach(fish => {
            if (speciesMap.has(fish.specie_code)) {
                speciesMap.set(fish.specie_code, [...speciesMap.get(fish.specie_code), specie]);
            } else {
                speciesMap.set(fish.specie_code, [specie]);
            }
        });
    });
    return speciesMap;
}