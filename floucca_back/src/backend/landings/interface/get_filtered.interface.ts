import {FishInterface} from "../../fish/interface/fish.interface";

export interface GetFilteredInterface {
    form: {
        form_id: number,
        port_id: number
    },
    fish?: { fish_id?: number,
        specie_code: number;
        landing_id?: number,
        gear_code?: number,
        fish_weight?: number,
        fish_length?: number,
        fish_quantity?: number
        price?:number,
        specieName: string }[]

}