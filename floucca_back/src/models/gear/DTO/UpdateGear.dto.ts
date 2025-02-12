import {IsNumber, IsPositive, IsString} from "class-validator";
import {Optional} from "@nestjs/common";

export class UpdateGearDto {
    @IsNumber()
    @IsPositive()
    @Optional()
    gear_code?: number;

    @IsString()
    @Optional()
    gear_name?: string;

    @IsNumber()
    @IsPositive()
    @Optional()
    equipment_id?: number;

    @IsString()
    @Optional()
    equipment_name?: string;
}