import {IsNumber, IsPositive, IsString, Length} from "class-validator";
import {Optional} from "@nestjs/common";

export class UpdateGearDto {
    @IsNumber()
    @IsPositive()
    @Optional()
    gear_code?: number;

    @IsString()
    @Optional()
    gear_name?: string;

    @IsString()
    @Optional()
    @Length(3,5)
    equipment_id?: string;

    @IsString()
    @Optional()
    equipment_name?: string;
}