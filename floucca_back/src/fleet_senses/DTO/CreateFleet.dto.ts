import {IsNumber} from "class-validator";

export class CreateFleetDto {
    @IsNumber()
    boat_details_id: number
    @IsNumber()
    form_id: number
}