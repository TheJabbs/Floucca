import {IsInt, IsOptional, IsPositive, IsString} from "class-validator";

export class CreateGearDetailDto {
    @IsPositive()
    @IsInt()
    gear_code: number;
    @IsOptional()
    @IsPositive()
    @IsInt()
    effort_today_id?: number;
    @IsString()
    detail_name: string;
    @IsString()
    detail_value: string;
}