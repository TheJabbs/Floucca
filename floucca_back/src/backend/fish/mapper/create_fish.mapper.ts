import {FishDto} from "../dto/create_fish.Dto";
import {CreateFishInterface} from "../interface/create_fish.interface";

export function mapCreateFishDtoToInterface(fish: FishDto): CreateFishInterface {
    return {
        specie_code: fish.specie_code,
        landing_id: fish.landing_id,
        gear_code: fish.gear_code,
        fish_weight: fish.fish_weight,
        fish_length: fish.fish_length,
        fish_quantity: fish.fish_quantity
    }
}