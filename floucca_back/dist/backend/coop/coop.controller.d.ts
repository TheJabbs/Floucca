import { CoopService } from "./coop.service";
import { CoopDto } from "./dto/coop.dto";
import { idDTO } from "../../shared/dto/id.dto";
export declare class CoopController {
    private coopService;
    constructor(coopService: CoopService);
    getAllCoops(): Promise<import("./interface/coop.interface").CoopInterface[]>;
    getCoopById(id: idDTO): Promise<import("./interface/coop.interface").CoopInterface>;
    createCoop(coop: CoopDto): Promise<import("./interface/coop.interface").CoopInterface> | "Coop already exists";
    updateCoop(coop: CoopDto, id: idDTO): Promise<import("./interface/coop.interface").CoopInterface> | "Coop does not exist";
    deleteCoop(id: idDTO): Promise<import("./interface/coop.interface").CoopInterface> | "Coop does not exist";
}
