import { fishLandingsByFilterInterface } from "../interface/fishLandingsByFilter.interface";
import { GetFilteredInterface } from "../../landings/interface/getFiltered.interface";

export function filterToFilteredInterfaceMapper(
    data: fishLandingsByFilterInterface[]
): GetFilteredInterface[] {
    return data.map(entry => ({
        form: {
            form_id: entry.form.form_id,
            port_id: entry.form.port_id
        },
        fish: entry.fish.length > 0 ? {
            specie_code: entry.fish[0].specie_code,
            gear_code: entry.fish[0].gear_code,
            fish_weight: entry.fish[0].fish_weight,
            fish_length: entry.fish[0].fish_length,
            fish_quantity: entry.fish[0].fish_quantity,
            price: entry.fish[0].price,
            specieName: entry.fish[0].specie.specie_name
        } : undefined
    }));
}
