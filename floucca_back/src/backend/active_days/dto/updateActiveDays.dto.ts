import {IsDate, IsInt, IsNotEmpty, IsOptional, IsPositive} from "class-validator";

export class UpdateActiveDaysDto {
    @IsInt()
    @IsPositive()
    @IsOptional()
    active_days: number;

}