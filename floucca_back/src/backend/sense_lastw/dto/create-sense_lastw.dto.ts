import {IsInt, IsPositive, IsOptional} from "class-validator";

export class CreateSenseLastwDto {
    @IsInt()
    days_fished: number;

    @IsInt()
    @IsPositive()
    gear_code: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    form_id?: number;

}
