import { FishService } from "./fish.service";
import { idDTO } from "../../shared/dto/id.dto";
import { CreateFishDto } from "./dto/create_fish.dto";
import { UpdateFishDto } from "./dto/update_fish.dto";
export declare class FishController {
    private fishService;
    constructor(fishService: FishService);
    getAllFish(): Promise<import("./interface/fish.interface").FishInterface[]>;
    getFishById(id: idDTO): Promise<import("./interface/fish.interface").FishInterface>;
    createFish(fish: CreateFishDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    updateFish(fish: UpdateFishDto, id: idDTO): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    deleteFish(id: idDTO): Promise<import("./interface/fish.interface").FishInterface>;
}
