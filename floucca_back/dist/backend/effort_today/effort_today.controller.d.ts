import { EffortTodayService } from "./effort_today.service";
import { CreateEffortTodayDto } from "./dto/effort_today.Dto";
import { idDTO } from "../../shared/dto/id.dto";
import { UpdateEffortDto } from "./dto/updateEffort.dto";
export declare class EffortTodayController {
    private readonly effortTodayService;
    constructor(effortTodayService: EffortTodayService);
    getAllEffortToday(): Promise<{
        effort_today_id: number;
        landing_id: number | null;
        hours_fished: number;
    }[]>;
    getEffortTodayById(id: idDTO): Promise<import("./interface/effort_today.interface").EffortTodayInterface>;
    createEffortToday(effort_today: CreateEffortTodayDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    updateEffortToday(effort_today: UpdateEffortDto, id: idDTO): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>> | "Effort today does not exist";
    deleteEffortToday(id: idDTO): Promise<import("./interface/effort_today.interface").EffortTodayInterface> | "Effort today does not exist";
}
