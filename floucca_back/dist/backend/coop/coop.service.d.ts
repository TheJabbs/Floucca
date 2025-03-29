import { CoopInterface } from "./interface/coop.interface";
import { PrismaService } from "../../prisma/prisma.service";
export declare class CoopService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllCoops(): Promise<CoopInterface[]>;
    getCoopById(coop_code: number): Promise<CoopInterface>;
    createCoop(coopToCreate: CoopInterface): Promise<CoopInterface>;
    updateCoop(coop_code: number, coopToUpdate: CoopInterface): Promise<CoopInterface>;
    deleteCoop(coop_code: number): Promise<CoopInterface>;
}
