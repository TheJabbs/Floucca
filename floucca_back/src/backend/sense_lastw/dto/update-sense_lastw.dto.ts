import { IsInt, IsPositive, IsString, IsDate } from "class-validator";
import { Optional } from "@nestjs/common";

export class UpdateSenseLastwDto {
    @Optional()
    @IsInt()
    @IsPositive()
    days_fished: number;

    @Optional()
    @IsInt()
    @IsPositive()
    gear_code: number;

    @Optional()
    @IsInt()
    @IsPositive()
    landing_id: number;

}