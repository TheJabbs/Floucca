import { CreateGearDetailDto } from "./dto/CreateGearDetail.dto";
import { GearDetailService } from "./gear_detail.service";
import { idDTO } from "../../shared/dto/id.dto";
import { UpdateGearDetailDto } from "./dto/UpdateGearDetail.dto";
export declare class GearDetailController {
    private readonly service;
    constructor(service: GearDetailService);
    getAllGearDetail(): Promise<import("./interface/GetAllGearDetail.Interface").GetAllGearDetail[]>;
    getGearDetailByCode(gear_detail_code: idDTO): Promise<import("./interface/GetAllGearDetail.Interface").GetAllGearDetail>;
    createGearDetail(newGearDetail: CreateGearDetailDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    deleteGearDetail(gear_detail_code: idDTO): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    updateGearDetail(gear_detail_code: idDTO, updatedGearDetail: UpdateGearDetailDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
}
