import { Prisma } from "@prisma/client";
import {IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString} from "class-validator";

export class CreateFormDto {
    @IsNumber()
    @IsPositive()
    user_id : number;

    @IsNumber()
    @IsPositive()
    port_id   :    number;
    @IsDate()
    @IsOptional()
    period_date ?: Date;

    @IsInt()
    @IsPositive()
    @IsOptional()
    boat_detail?: number

    @IsString()
    fisher_name : string

}
