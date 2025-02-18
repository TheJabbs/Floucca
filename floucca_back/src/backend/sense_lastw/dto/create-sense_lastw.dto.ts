import { IsInt, IsPositive, IsString, IsDate } from "class-validator";

export class CreateSenseLastwDto {
    @IsInt()
    @IsPositive()
    days_fished: number;

    @IsInt()
    @IsPositive()
    gear_code: number;

    @IsInt()
    @IsPositive()
    landing_id: number;

}
