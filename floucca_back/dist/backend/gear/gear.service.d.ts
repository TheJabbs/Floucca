import { GetAllGearInterface } from "./interface/GetAllGear.interface";
import { CreateGearDto } from "./dto/CreateGear.dto";
import Any = jasmine.Any;
import { PrismaService } from "../../prisma/prisma.service";
import { ResponseMessage } from "../../shared/interface/response.interface";
export declare class GearService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllGear(): Promise<GetAllGearInterface[]>;
    getGearById(id: number): Promise<GetAllGearInterface>;
    createGear(gear: CreateGearDto): Promise<ResponseMessage<any>>;
    updateGear(id: number, gear: CreateGearDto): Promise<ResponseMessage<Any>>;
    deleteGear(id: number): Promise<ResponseMessage<Any>>;
}
