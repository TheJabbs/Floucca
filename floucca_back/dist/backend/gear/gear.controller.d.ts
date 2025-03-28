import { GearService } from "./gear.service";
import { GearIdDto } from "./DTO/GearId.dto";
import { CreateGearDto } from "./DTO/CreateGear.dto";
export declare class GearController {
    private readonly service;
    constructor(service: GearService);
    getAllGear(): Promise<import("./interface/GetAllGear.interface").GetAllGearInterface[]>;
    getGearByCode(gear_code: GearIdDto): Promise<import("./interface/GetAllGear.interface").GetAllGearInterface>;
    createGear(newGear: CreateGearDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    deleteGear(gear_code: GearIdDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<jasmine.Any>>;
    updateGear(gear_code: GearIdDto, updatedGear: CreateGearDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<jasmine.Any>>;
}
