import { PeriodService } from "./period.service";
import { UpdateGearDetailDto } from "../gear_detail/dto/UpdateGearDetail.dto";
import { ResponseMessage } from "../../shared/interface/response.interface";
export declare class PeriodController {
    private readonly periodService;
    constructor(periodService: PeriodService);
    getAllPeriod(): Promise<import("./interface/getAllPeriod.interface").GetAllPeriodInterface[]>;
    getPeriodById(periodId: Date): Promise<import("./interface/getAllPeriod.interface").GetAllPeriodInterface>;
    updatePeriod(periodId: Date, updatedPeriod: UpdateGearDetailDto): Promise<ResponseMessage<any>>;
    deletePeriod(periodId: Date): Promise<ResponseMessage<any>>;
}
