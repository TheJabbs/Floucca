import {IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString} from "class-validator";
import {Optional} from "@nestjs/common";

export class UpdateFormDto {
    @IsNumber()
    @IsPositive()
    @Optional()
    user_id : number;
    @IsNumber()
    @IsPositive()
    @Optional()
    port_id   :    number;
    @IsDate()
    @Optional()
    period_date : Date;
    @IsString()
    @Optional()
    fisher_name : string
    @IsInt()
    @IsPositive()
    @IsOptional()
    boat_detail?: number
}