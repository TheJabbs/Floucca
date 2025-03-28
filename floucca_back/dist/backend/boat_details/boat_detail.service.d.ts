import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoatDetailsDto } from './dto';
import { GetAllBoatDetailsInterface } from "./interface";
import { ResponseMessage } from "../../shared/interface/response.interface";
export declare class BoatDetailsServices {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllBoatDetails(): Promise<GetAllBoatDetailsInterface[]>;
    getBoatDetailsByBDID(boat_details_id: number): Promise<GetAllBoatDetailsInterface>;
    getBoatDetailByFleetOwner(fleet_owner: string): Promise<GetAllBoatDetailsInterface>;
    createBoatDetails(newBoatDetails: CreateBoatDetailsDto): Promise<ResponseMessage<any>>;
    updateBoatDetails(): Promise<void>;
    deleteBoatDetails(BoatDetailsId: number): Promise<ResponseMessage<any>>;
    private validateIds;
}
