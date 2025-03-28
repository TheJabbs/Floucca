import { PrismaService } from "../../prisma/prisma.service";
import { CreateSpecieDto } from "./dto/create-species.dto";
import { Specie } from "./interfaces/species.interface";
export declare class SpecieService {
    private prisma;
    constructor(prisma: PrismaService);
    validateSpecie(specie_code: number, checkExists?: boolean): Promise<void>;
    createSpecie(createSpecieDto: CreateSpecieDto): Promise<Specie>;
    findAllSpecies(): Promise<Specie[]>;
    findSpecieById(specie_code: number): Promise<Specie | null>;
    updateSpecie(specie_code: number, updateSpecieDto: CreateSpecieDto): Promise<Specie>;
    deleteSpecie(specie_code: number): Promise<Specie>;
}
