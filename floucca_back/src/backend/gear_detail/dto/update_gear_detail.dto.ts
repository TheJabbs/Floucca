import {IsInt, IsPositive, IsString} from "class-validator";
import {Optional} from "@nestjs/common";

export class UpdateGearDetailDto{

    @IsPositive()
    @IsInt()
    @Optional()
    gear_code: number;
    @IsPositive()
    @IsInt()
    @Optional()
    effort_today_id: number;
    @IsString()
    @Optional()
    detail_name: string;
    @IsString()
    @Optional()
    detail_value: string;
}
