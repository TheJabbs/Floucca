import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateFormDto} from "./DTO/CreateForm.dto";
import { GetAllFormInterface} from './interface/index'
import {UpdateFormDto} from "./DTO/UpdateForm.dto";
import {PrismaService} from "../../prisma/prisma.service";
import {ResponseMessage} from "../../shared/interface/response.interface";
import { GetUserFormsInterface } from "./interface/GetUserForms.interface";

@Injectable()
export class FormService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getAllForms(): Promise<GetAllFormInterface[]> {
        const form = await this.prisma.form.findMany();

        if (!form || form.length === 0) {
            throw new NotFoundException('No forms found');
        }

        return form;
    }

    async getTopFormsByUser(user_id: number): Promise<GetUserFormsInterface[]> {
        console.log("Fetching top 20 forms for user ID:", user_id);
    
        const userExists = await this.prisma.users.findUnique({
          where: { user_id },
        });
    
        if (!userExists) {
          throw new NotFoundException(`User with ID ${user_id} not found.`);
        }
    
        const forms = await this.prisma.form.findMany({
          where: { user_id },
          orderBy: { creation_time: "desc" }, 
          take: 20, 
          select: {
            form_id: true,
            user_id: true,
            port_id: true,
            period_date: true,
            fisher_name: true,
            creation_time: true,
            ports: { select: { port_name: true } }, 
            boat_details: { 
              select: {
                boat_id: true,
                fleet_owner: true,
                fleet_size: true,
                fleet_crew: true,
                fleet_max_weight: true,
                fleet_length: true,
                fleet_registration: true
              }
            }
          },
        });
    
        return forms.map(form => ({
          form_id: form.form_id,
          user_id: form.user_id,
          port_id: form.port_id,
          period_date: form.period_date,
          fisher_name: form.fisher_name,
          creation_time: form.creation_time,
          ports: form.ports,
          boat_details: form.boat_details,
        }));
    }
    

    async getFormById(id: number): Promise<GetAllFormInterface> {
        const form = await this.prisma.form.findUnique({
            where: {form_id: id}
        });

        if (!form) {
            throw new NotFoundException('No form found');
        }

        return form;
    }

    async createForm(form: CreateFormDto): Promise<ResponseMessage<any>> {
        if(!await this.validate(form.user_id, form.port_id)){
            return {
                message: 'User or port not found'
            }
        }

        const newForm = await this.prisma.form.create({
            data: form
        });

        return {
            message: 'Form created successfully',
            data: newForm
        }
    }

    async deleteForm(id: number): Promise<ResponseMessage<any>> {

        const check = await this.prisma.form.findUnique({
            where: {form_id: id}
        });

        if (!check) {
            return {
                message: 'Form not found'

            }
        }

        const form = await this.prisma.form.delete({
            where: {form_id: id}
        });

        return {
            message: 'Form deleted successfully',
            data: form
        }
    }

    async updateForm(id: number, form: UpdateFormDto): Promise<ResponseMessage<any>> {
        const check = await this.prisma.form.findUnique({
            where: {form_id: id}
        });

        if (!check) {
            return {
                message: 'Form not found'
            }
        }

        if(!await this.validate(form.user_id, form.port_id)){
            return {
                message: 'User or port not found'
            }
        }

        const updatedForm = await this.prisma.form.update({
            where: {form_id: id},
            data: {
                user_id: form.user_id,
                port_id: form.port_id,
                period_date: form.period_date,
                fisher_name: form.fisher_name
            }
        });

        return {
            message: 'Form updated successfully',
            data: updatedForm
        }
    }

    


    async validate(user_id?: number, port_id?: number): Promise<boolean> {
    const user = user_id ? await this.prisma.users.findFirst({
        where: { user_id: user_id }
    }) : null;

    const port = port_id ? await this.prisma.ports.findFirst({
        where: { port_id: port_id }
    }) : null;

    const period = await this.prisma.period.findFirst({
        where: { period_date: new Date() }
    })

    return !!user || !!port || period.period_status === "B";
}


}