import {IsDate, IsInt, IsNotEmpty, IsOptional, IsPositive} from "class-validator";

export class CreateActiveDaysDto {
    @IsDate()
    @IsNotEmpty()
    period_date: Date;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    port_id: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    gear_code: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    active_fays: number;

}