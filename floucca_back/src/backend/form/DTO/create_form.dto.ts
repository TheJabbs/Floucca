import {IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString} from "class-validator";
import {Transform} from "class-transformer";

export class CreateFormDto {
    @IsNumber()
    @IsPositive()
    user_id : number;

    @IsNumber()
    @IsPositive()
    port_id   :    number;

    @IsOptional()
    @Transform(({ value }) => new Date(value).toISOString())
    period_date ?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    boat_detail?: number

    @IsString()
    fisher_name : string

}
