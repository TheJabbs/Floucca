import { CreateGearUsageDto, UpdateGearUsageDto } from "./dto/index";
import { GearUsageService } from "./gear_usage.service";
import { idDTO } from "../../shared/dto/id.dto";
export declare class GearUsageController {
    private readonly gearUsageService;
    constructor(gearUsageService: GearUsageService);
    getAllGearUsage(): Promise<import("./interface").GetAllGearUsageInterface[]>;
    getGearUsageByGearUsageId(gearUsageId: idDTO): Promise<import("./interface").GetAllGearUsageInterface>;
    createGearUsage(newGearUsage: CreateGearUsageDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    updateGearUsage(gearUsageId: idDTO, updatedGearUsage: UpdateGearUsageDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    deleteGearUsage(gearUsageId: idDTO): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
}
