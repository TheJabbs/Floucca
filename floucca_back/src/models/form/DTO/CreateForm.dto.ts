import {IsDate, IsNumber, IsPositive, IsString} from "class-validator";
import {Optional} from "@nestjs/common";

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
    fisher_name : string
}
