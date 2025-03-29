import { CreateFormDto } from "./dto/CreateForm.dto";
import { GetAllFormInterface } from './interface/index';
import { UpdateFormDto } from "./dto/UpdateForm.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { ResponseMessage } from "../../shared/interface/response.interface";
import { GetTopFormsInterface } from "./interface/index";
export declare class FormService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllForms(): Promise<GetAllFormInterface[]>;
    getTopFormsByUser(user_id: number): Promise<GetTopFormsInterface[]>;
    getFormById(id: number): Promise<GetAllFormInterface>;
    createForm(form: CreateFormDto): Promise<ResponseMessage<any>>;
    deleteForm(id: number): Promise<ResponseMessage<any>>;
    updateForm(id: number, form: UpdateFormDto): Promise<ResponseMessage<any>>;
    validate(user_id?: number, port_id?: number): Promise<boolean>;
}
