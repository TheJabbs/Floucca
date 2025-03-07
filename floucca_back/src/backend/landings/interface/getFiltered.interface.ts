import {FishInterface} from "../../fish/interface/fish.interface";

export interface GetFilteredInterface {
    form: {
        form_id: number,
        port_id: number
    },
    fish?: FishInterface[]

}