import { FormulasService } from "./formulas.service";
import { GeneralFilterDto } from "../shared/dto/GeneralFilter.dto";
export declare class FormulasController {
    private readonly service;
    constructor(service: FormulasService);
    getEffortAndLanding(filter: GeneralFilterDto): Promise<any>;
}
