import {IsNumber, IsPositive, IsString} from "class-validator";

export class CreateGearDto {
    @IsNumber()
    @IsPositive()
    gear_code: number;

    @IsString()
    gear_name: string;

    @IsNumber()
    @IsPositive()
    equipment_id: number;

    @IsString()
    equipment_name: string;

}