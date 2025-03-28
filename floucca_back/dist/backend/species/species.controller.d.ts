import { SpecieService } from "./species.service";
import { CreateSpecieDto } from "./dto/create-species.dto";
import { Specie } from "./interfaces/species.interface";
export declare class SpecieController {
    private readonly specieService;
    constructor(specieService: SpecieService);
    createSpecie(createSpecieDto: CreateSpecieDto): Promise<Specie>;
    findAllSpecies(): Promise<Specie[]>;
    findSpecieById(specie_code: number): Promise<Specie | null>;
    updateSpecie(specie_code: number, updateSpecieDto: CreateSpecieDto): Promise<Specie>;
    deleteSpecie(specie_code: number): Promise<Specie>;
}
