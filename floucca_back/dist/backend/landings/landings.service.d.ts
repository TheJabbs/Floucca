import { PrismaService } from "../../prisma/prisma.service";
import { GetAllLandingsInterface } from "./interface/getAllLandings.interface";
import { CreateLandingDto } from "./dto/createLandings.dto";
import { ResponseMessage } from "../../shared/interface/response.interface";
import { UpdateLandingsDto } from "./dto/updateLandings.dto";
import { CreateFormLandingDto } from "./dto/CreateFormLanding.dto";
import { GeneralFilterDto } from "../../shared/dto/GeneralFilter.dto";
import { GetFilteredInterface } from "./interface/getFiltered.interface";
export declare class LandingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllLandings(): Promise<GetAllLandingsInterface[]>;
    getLandingById(id: number): Promise<GetAllLandingsInterface>;
    createLanding(landing: CreateLandingDto): Promise<ResponseMessage<any>>;
    deleteLanding(id: number): Promise<ResponseMessage<any>>;
    updateLanding(id: number, landing: UpdateLandingsDto): Promise<ResponseMessage<any>>;
    createLandingForm(l: CreateFormLandingDto): Promise<ResponseMessage<any>>;
    getLandingsByFilter(filter: GeneralFilterDto): Promise<GetFilteredInterface[]>;
    validate(d: any): Promise<boolean>;
}
