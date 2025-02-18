import {IsDecimal, IsInt, IsPositive} from "class-validator";

export class CreateLandingDto {
    @IsInt()
    @IsPositive()
    form_id: number;

    @IsInt()
    @IsPositive()
    boat_details_id: number;

    @IsDecimal()
    @IsPositive()
    latitude: number;

    @IsDecimal()
    @IsPositive()
    longitude: number;
}