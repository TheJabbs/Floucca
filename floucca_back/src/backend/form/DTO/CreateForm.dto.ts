import { Prisma } from "@prisma/client";
import {IsDate, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString} from "class-validator";

export class CreateFormDto {
    @IsNumber()
    @IsPositive()
    user_id : number;

    @IsNumber()
    @IsPositive()
    port_id   :    number;
    @IsDate()
    period_date : Date;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    boat_detail?: number

    @IsString()
    fisher_name : string

}
