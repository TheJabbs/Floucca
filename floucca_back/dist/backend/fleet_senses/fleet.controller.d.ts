import { FleetService } from "./fleet.service";
import { CreateFleetDto } from "./dto";
import { idDTO } from "../../shared/dto/id.dto";
import { CreateFleetFormDto } from "./dto/create_fleet_form.dto";
export declare class FleetController {
    private readonly fleetService;
    constructor(fleetService: FleetService);
    getAllFleetSenses(): Promise<import("./interface/get_all_fleet.interface").GetAllFleetInterface[]>;
    getFleetSensesByFSID(FSID: idDTO): Promise<import("./interface/get_all_fleet.interface").GetAllFleetInterface>;
    getAllFleetByDate(start: string, end: string): Promise<import("./interface/get_all_fleet.interface").GetAllFleetInterface[]>;
    createFleetSenses(newFleet: CreateFleetDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    deleteFleetSenses(FSID: idDTO): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    updateFleetSenses(FSID: idDTO, updatedFleet: CreateFleetDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    createSenseForm(senseForm: CreateFleetFormDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
}
