import { GearService } from "./gear.service";
import { GearIdDto } from "./dto/gear_id.dto";
import { CreateGearDto } from "./dto/create_gear.dto";
export declare class GearController {
    private readonly service;
    constructor(service: GearService);
    getAllGear(): Promise<import("./interface/get_all_gear.interface").GetAllGearInterface[]>;
    getGearByCode(gear_code: GearIdDto): Promise<import("./interface/get_all_gear.interface").GetAllGearInterface>;
    createGear(newGear: CreateGearDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    deleteGear(gear_code: GearIdDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<jasmine.Any>>;
    updateGear(gear_code: GearIdDto, updatedGear: CreateGearDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<jasmine.Any>>;
}
