import {GetFilteredInterface} from "../../backend/landings/interface/getFiltered.interface";
// return map with specie code and howmany time it was landed
export function mapLandingsBySpecieMapper(landings: GetFilteredInterface[]):Map<number,number>{
    const landingsBySpecie = new Map<number,number>();
    landings.forEach(landing => {
        landing.fish.forEach(fish => {
            if(landingsBySpecie.has(fish.specie_code)){
                landingsBySpecie.set(fish.specie_code, landingsBySpecie.get(fish.specie_code) + 1);
            }else{
                landingsBySpecie.set(fish.specie_code, 1);
            }
        });
    });
    return landingsBySpecie;
}