import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {FormService} from "./form.service";
import {idDTO} from "../../shared/dto/id.dto";
import { GetTopFormsInterface } from "./interface/index";
import {UpdateFormDto} from "./dto/update_form.dto";
import {CreateFormDto} from "./dto/create_form.dto";

@Controller('api/dev/form')
export class FormController {
    constructor(private readonly formService: FormService) {
    }

    @Get('/all/forms')
    getAllForms() {
        return this.formService.getAllForms();
    }

    @Get('/form/:form_id')
    getFormById(@Param('form_id') form_id: idDTO) {
        return this.formService.getFormById(form_id.id);
    }

    @Get("/top/:user_id")
    async getTopFormsByUser(@Param("user_id") id: number): Promise<GetTopFormsInterface[]> {
        console.log("Received request for top 20 forms of user ID:", id);
        return this.formService.getTopFormsByUser(id);
    }
    



    @Post('/create/form')
    createForm(@Body() newForm: CreateFormDto) {
        return this.formService.createForm(newForm);
    }

    @Delete('/delete/form/:form_id')
    deleteForm(@Param('form_id') form_id: idDTO) {
        return this.formService.deleteForm(form_id.id);
    }

    @Put('/update/form/:form_id')
    updateForm(@Param('form_id') form_id: idDTO, @Body() updatedForm: UpdateFormDto) {
        return this.formService.updateForm(form_id.id, updatedForm);
    }

}