import {IsDate, IsInt, IsNotEmpty, IsOptional, IsPositive} from "class-validator";

export class UpdateActiveDaysDto {
    @IsDate()
    @IsOptional()
    period_date: Date;

    @IsInt()
    @IsPositive()
    @IsOptional()
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