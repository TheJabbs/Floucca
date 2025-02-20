import {IsInt, IsPositive, IsString} from "class-validator";

export class CreateGearDetailDto {
    @IsPositive()
    @IsInt()
    gear_code: number;
    @IsPositive()
    @IsInt()
    effort_today_id: number;
    @IsString()
    detail_name: string;
    @IsString()
    detail_value: string;
}