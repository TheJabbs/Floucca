import {IsDecimal, IsInt, IsPositive} from "class-validator";
import {Optional} from "@nestjs/common";

export class CreateLandingDto {
    @IsInt()
    @IsPositive()
    @Optional()
    form_id?: number;

    @IsDecimal()
    @IsPositive()
    latitude: number;

    @IsDecimal()
    @IsPositive()
    longitude: number;
}