import {GetFilteredInterface} from "../../backend/landings/interface/get_filtered.interface";

export function specieMapMapper(data: GetFilteredInterface[]): Map<number, GetFilteredInterface[]>{
    const mapUsingSpecieId: Map<number, GetFilteredInterface[]> = new Map();

    data.forEach((element) => {
        if (mapUsingSpecieId.has(element.fish.specie_code)) {
            mapUsingSpecieId.get(element.fish.specie_code).push(element);
        } else {
            mapUsingSpecieId.set(element.fish.specie_code, [element]);
        }
    });

    return mapUsingSpecieId;
}