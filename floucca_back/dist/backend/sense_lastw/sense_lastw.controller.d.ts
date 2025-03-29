import { SenseLastwService } from './sense_lastw.service';
import { CreateSenseLastwDto } from './dto/create-sense_lastw.dto';
import { UpdateSenseLastwDto } from './dto/update-sense_lastw.dto';
import { idDTO } from '../../shared/dto/id.dto';
export declare class SenseLastwController {
    private readonly service;
    constructor(service: SenseLastwService);
    getAllSenseLastw(): Promise<import("./interface/get_all_sense_lastw.interface").GetAllSenseLastw[]>;
    getSenseLastwById(sense_lastw_id: idDTO): Promise<import("./interface/get_all_sense_lastw.interface").GetAllSenseLastw>;
    createSenseLastw(newSenseLastw: CreateSenseLastwDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    deleteSenseLastw(sense_lastw_id: idDTO): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    updateSenseLastw(sense_lastw_id: idDTO, updatedSenseLastw: UpdateSenseLastwDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
}
