import { GetAllGearUsageInterface } from "./interface";
import { CreateGearUsageDto, UpdateGearUsageDto } from "./dto";
import { PrismaService } from "../../prisma/prisma.service";
import { ResponseMessage } from "../../shared/interface/response.interface";
export declare class GearUsageService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllGearUsage(): Promise<GetAllGearUsageInterface[]>;
    getGearUsageById(id: number): Promise<GetAllGearUsageInterface>;
    createGearUsage(gearUsage: CreateGearUsageDto): Promise<ResponseMessage<any>>;
    updateGearUsage(id: number, gearUsage: UpdateGearUsageDto): Promise<ResponseMessage<any>>;
    deleteGearUsage(id: number): Promise<ResponseMessage<any>>;
    validate(fleet_senses_id: number, gear_code: number): Promise<boolean>;
}
