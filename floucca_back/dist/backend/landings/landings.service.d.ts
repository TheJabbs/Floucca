import { PrismaService } from "../../prisma/prisma.service";
import { GetAllLandingsInterface } from "./interface/get_all_landings.interface";
import { CreateLandingDto } from "./dto/create_landings.dto";
import { ResponseMessage } from "../../shared/interface/response.interface";
import { UpdateLandingsDto } from "./dto/update_landings.dto";
import { CreateFormLandingDto } from "./dto/create_form_landing.dto";
import { GeneralFilterDto } from "../../shared/dto/general_filter.dto";
import { GetFilteredInterface } from "./interface/get_filtered.interface";
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
