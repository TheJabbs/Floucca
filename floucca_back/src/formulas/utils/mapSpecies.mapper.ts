import { FishInterface } from "../../backend/fish/interface/fish.interface";
import { GetFilteredInterface } from "../../backend/landings/interface/getFiltered.interface";

export function mapSpeciesMapper(species: GetFilteredInterface[]): Map<number, FishInterface[]> {
    const speciesMap = new Map<number, FishInterface[]>();

    species.forEach(landing => {
        if (landing.fish) {
            landing.fish.forEach(fish => {
                if (!speciesMap.has(fish.specie_code)) {
                    speciesMap.set(fish.specie_code, []);
                }
                speciesMap.get(fish.specie_code)!.push(fish);
            });
        }
    });

    return speciesMap;
}