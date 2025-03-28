import { EffortTodayInterface } from "./interface/effort_today.interface";
import { CreateEffortTodayDto } from "./dto/effort_today.Dto";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateEffortDto } from "./dto/updateEffort.dto";
import { ResponseMessage } from "../../shared/interface/response.interface";
export declare class EffortTodayService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllEffortToday(): Promise<{
        effort_today_id: number;
        landing_id: number | null;
        hours_fished: number;
    }[]>;
    getEffortTodayById(id: number): Promise<EffortTodayInterface>;
    createEffortToday(effort_today: CreateEffortTodayDto): Promise<ResponseMessage<any>>;
    updateEffortToday(id: number, effort_today: UpdateEffortDto): Promise<ResponseMessage<any>>;
    deleteEffortToday(id: number): Promise<EffortTodayInterface>;
}
