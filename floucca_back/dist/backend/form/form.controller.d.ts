import { FormService } from "./form.service";
import { CreateFormDto, UpdateFormDto } from "./dto/index";
import { idDTO } from "../../shared/dto/id.dto";
import { GetTopFormsInterface } from "./interface/index";
export declare class FormController {
    private readonly formService;
    constructor(formService: FormService);
    getAllForms(): Promise<import("./interface/GetAllForm.interface").GetAllFormInterface[]>;
    getFormById(form_id: idDTO): Promise<import("./interface/GetAllForm.interface").GetAllFormInterface>;
    getTopFormsByUser(id: number): Promise<GetTopFormsInterface[]>;
    createForm(newForm: CreateFormDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    deleteForm(form_id: idDTO): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
    updateForm(form_id: idDTO, updatedForm: UpdateFormDto): Promise<import("../../shared/interface/response.interface").ResponseMessage<any>>;
}
