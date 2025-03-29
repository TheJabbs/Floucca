import { PeriodService } from "./period.service";
import { UpdateGearDetailDto } from "../gear_detail/dto/update_gear_detail.dto";
import { ResponseMessage } from "../../shared/interface/response.interface";
export declare class PeriodController {
    private readonly periodService;
    constructor(periodService: PeriodService);
    getAllPeriod(): Promise<import("./interface/get_all_period.interface").GetAllPeriodInterface[]>;
    getPeriodById(periodId: Date): Promise<import("./interface/get_all_period.interface").GetAllPeriodInterface>;
    updatePeriod(periodId: Date, updatedPeriod: UpdateGearDetailDto): Promise<ResponseMessage<any>>;
    deletePeriod(periodId: Date): Promise<ResponseMessage<any>>;
}
