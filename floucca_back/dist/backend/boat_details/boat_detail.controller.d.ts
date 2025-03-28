import { BoatDetailsServices } from './boat_detail.service';
import { CreateBoatDetailsDto } from './dto';
import { idDTO } from "../../shared/dto/id.dto";
export declare class BoatDetailsController {
    private readonly boatDetailsService;
    constructor(boatDetailsService: BoatDetailsServices);
    getAllBoatDetails(): Promise<import("./interface").GetAllBoatDetailsInterface[]>;
    getBoatDetailsByBDID(BDID: idDTO): Promise<import("./interface").GetAllBoatDetailsInterface>;
    createBoatDetails(newBoatDetails: CreateBoatDetailsDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    deleteBoatDetails(BDID: idDTO): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
}
