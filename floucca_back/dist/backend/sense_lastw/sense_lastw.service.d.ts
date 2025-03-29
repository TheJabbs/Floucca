import { PrismaService } from '../../prisma/prisma.service';
import { ResponseMessage } from '../../shared/interface/response.interface';
import { GetAllSenseLastw } from './interface/get_all_sense_lastw.interface';
import { CreateSenseLastwDto } from './dto/create-sense_lastw.dto';
import { UpdateSenseLastwDto } from './dto/update-sense_lastw.dto';
import { GeneralFilterDto } from "../../shared/dto/general_filter.dto";
import { GetFilteredLastWInterface } from "./interface/get_filtered_lastw.interface";
export declare class SenseLastwService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllSenseLastw(): Promise<GetAllSenseLastw[]>;
    getSenseLastwById(id: number): Promise<GetAllSenseLastw>;
    createSenseLastw(sense_lastw: CreateSenseLastwDto): Promise<ResponseMessage<any>>;
    deleteSenseLastw(id: number): Promise<ResponseMessage<any>>;
    updateSenseLastw(id: number, sense_lastw: UpdateSenseLastwDto): Promise<ResponseMessage<any>>;
    getEffortsByFilter(filter: GeneralFilterDto): Promise<GetFilteredLastWInterface[]>;
    validate(d: any): Promise<boolean>;
}
