import {FishInterface} from "../../fish/interface/fish.interface";

export interface GetFilteredInterface {
    form: {
        form_id: number,
        port_id: number
    },
    fish?: {
        specie_code: number;
        gear_code: number,
        fish_weight: number,
        fish_length: number,
        fish_quantity: number
        price:number,
        specieName: string
    }

}