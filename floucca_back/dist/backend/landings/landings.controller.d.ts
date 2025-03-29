import { LandingsService } from "./landings.service";
import { idDTO } from "../../shared/dto/id.dto";
import { CreateLandingDto } from "./dto/create_landings.dto";
import { UpdateLandingsDto } from "./dto/update_landings.dto";
import { CreateFormLandingDto } from "./dto/create_form_landing.dto";
export declare class LandingsController {
    private readonly service;
    constructor(service: LandingsService);
    getAllLandings(): Promise<import("./interface/get_all_landings.interface").GetAllLandingsInterface[]>;
    getLandingById(landing_id: idDTO): Promise<import("./interface/get_all_landings.interface").GetAllLandingsInterface>;
    createLanding(newLanding: CreateLandingDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    deleteLanding(landing_id: idDTO): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    updateLanding(landing_id: idDTO, updatedLanding: UpdateLandingsDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    createFormLanding(formLanding: CreateFormLandingDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
}
