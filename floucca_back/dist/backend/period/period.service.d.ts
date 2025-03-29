import { ResponseMessage } from "../../shared/interface/response.interface";
import { GetAllPeriodInterface } from "./interface/getAllPeriod.interface";
import { UpdateGearDetailDto } from "../gear_detail/dto/UpdateGearDetail.dto";
import { PrismaService } from "../../prisma/prisma.service";
export declare class PeriodService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllPeriod(): Promise<GetAllPeriodInterface[]>;
    getPeriodById(periodId: Date): Promise<GetAllPeriodInterface>;
    updatePeriod(periodId: Date, updatedPeriod: UpdateGearDetailDto): Promise<ResponseMessage<any>>;
    deletePeriod(periodId: Date): Promise<{
        message: string;
    }>;
}
