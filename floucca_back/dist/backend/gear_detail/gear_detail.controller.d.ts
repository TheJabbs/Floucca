import { CreateGearDetailDto } from "./dto/create_gear_detail.dto";
import { GearDetailService } from "./gear_detail.service";
import { idDTO } from "../../shared/dto/id.dto";
import { UpdateGearDetailDto } from "./dto/update_gear_detail.dto";
export declare class GearDetailController {
    private readonly service;
    constructor(service: GearDetailService);
    getAllGearDetail(): Promise<import("./interface/get_all_gear_detail.interface").GetAllGearDetail[]>;
    getGearDetailByCode(gear_detail_code: idDTO): Promise<import("./interface/get_all_gear_detail.interface").GetAllGearDetail>;
    createGearDetail(newGearDetail: CreateGearDetailDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    deleteGearDetail(gear_detail_code: idDTO): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    updateGearDetail(gear_detail_code: idDTO, updatedGearDetail: UpdateGearDetailDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
}
