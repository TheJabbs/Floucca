import {IsNumber} from "class-validator";
import {Optional} from "@nestjs/common";

export class CreateFleetDto {
    @IsNumber()
    boat_details_id: number
    @IsNumber()
    @Optional()
    form_id?: number
}