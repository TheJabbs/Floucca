import {IsDate, IsNumber, IsPositive, IsString} from "class-validator";

export class CreateFormDto {
    @IsNumber()
    @IsPositive()
    user_id : number;
    @IsNumber()
    @IsPositive()
    port_id   :    number;
    @IsDate()
    period_date : Date;
    @IsString()
    form_type: string;
    @IsString()
    fisher_name : string
}
