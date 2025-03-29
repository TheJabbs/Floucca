import {IsDecimal, IsInt, IsOptional, IsPositive} from "class-validator";

export class CreateLandingDto {
    @IsOptional()
    @IsInt()
    @IsPositive()
    form_id?: number;

    @IsPositive()
    latitude: number;

    @IsPositive()
    longitude: number;
}