import { GetAllFleetInterface } from "./Interface/GetAllFleetInterface";
import { CreateFleetDto } from "./DTO";
import { PrismaService } from "../../prisma/prisma.service";
import { ResponseMessage } from "../../shared/interface/response.interface";
import { SenseFormContentInterface } from "./Interface/senseFormContent.interface";
export declare class FleetService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllFleet(): Promise<GetAllFleetInterface[]>;
    getFleetById(id: number): Promise<GetAllFleetInterface>;
    createFleet(fleet: CreateFleetDto): Promise<ResponseMessage<any>>;
    updateFleet(id: number, fleet: CreateFleetDto): Promise<ResponseMessage<any>>;
    deleteFleet(id: number): Promise<ResponseMessage<any>>;
    getAllFleetByDate(start: Date, end: Date): Promise<GetAllFleetInterface[]>;
    validate(form_id: number): Promise<boolean>;
    createFleetSensesForm(content: SenseFormContentInterface): Promise<ResponseMessage<any>>;
}
