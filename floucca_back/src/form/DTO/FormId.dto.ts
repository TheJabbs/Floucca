import {IsNumber, IsPositive} from "class-validator";

export class FormIdDto {
    @IsNumber()
    @IsPositive()
    form_id: number;
}