import { FleetService } from "./fleet.service";
import { CreateFleetDto } from "./DTO";
import { idDTO } from "../../shared/dto/id.dto";
import { CreateFleetFormDto } from "./DTO/CreateFleetForm.dto";
export declare class FleetController {
    private readonly fleetService;
    constructor(fleetService: FleetService);
    getAllFleetSenses(): Promise<import("./Interface/GetAllFleetInterface").GetAllFleetInterface[]>;
    getFleetSensesByFSID(FSID: idDTO): Promise<import("./Interface/GetAllFleetInterface").GetAllFleetInterface>;
    getAllFleetByDate(start: string, end: string): Promise<import("./Interface/GetAllFleetInterface").GetAllFleetInterface[]>;
    createFleetSenses(newFleet: CreateFleetDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    deleteFleetSenses(FSID: idDTO): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    updateFleetSenses(FSID: idDTO, updatedFleet: CreateFleetDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    createSenseForm(senseForm: CreateFleetFormDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
}
