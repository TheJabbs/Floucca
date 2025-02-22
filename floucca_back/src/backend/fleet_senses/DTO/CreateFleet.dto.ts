import {IsNumber} from "class-validator";
import {Optional} from "@nestjs/common";

export class CreateFleetDto {
    @IsNumber()
    @Optional()
    form_id?: number
}