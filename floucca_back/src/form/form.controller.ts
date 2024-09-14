import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {FormService} from "./form.service";
import {CreateFormDto, FormIdDto, UpdateFormDto,} from "./DTO/index";

@Controller('api/dev/form')
export class FormController {
    constructor(private readonly formService: FormService) {
    }

    @Get('/all/forms')
    getAllForms() {
        return this.formService.getAllForms();
    }

    @Get('/form/:form_id')
    getFormById(@Param('form_id') form_id: FormIdDto) {
        return this.formService.getFormById(form_id.form_id);
    }

    @Post('/create/form')
    createForm(@Body() newForm: CreateFormDto) {
        return this.formService.createForm(newForm);
    }

    @Delete('/delete/form/:form_id')
    deleteForm(@Param('form_id') form_id: FormIdDto) {
        return this.formService.deleteForm(form_id.form_id);
    }

    @Put('/update/form/:form_id')
    updateForm(@Param('form_id') form_id: FormIdDto, @Body() updatedForm: UpdateFormDto) {
        return this.formService.updateForm(form_id.form_id, updatedForm);
    }

}