import {IsNumber, IsPositive, IsString, Length} from "class-validator";

export class CreateGearDto {
    @IsNumber()
    @IsPositive()
    gear_code: number;

    @IsString()
    gear_name: string;

    @IsString()
    @Length(3,5)
    equipment_id: string;

    @IsString()
    equipment_name: string;

}