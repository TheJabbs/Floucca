import { FormulasService } from "./formulas.service";
import { GeneralFilterDto } from "../shared/dto/general_filter.dto";
export declare class FormulasController {
    private readonly service;
    constructor(service: FormulasService);
    getEffortAndLanding(filter: GeneralFilterDto): Promise<any>;
}
