import {IsInt, IsPositive, IsString, IsDate, IsOptional} from "class-validator";

export class CreateSenseLastwDto {
    @IsInt()
    @IsPositive()
    days_fished: number;

    @IsInt()
    @IsPositive()
    gear_code: number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    form_id?: number;

}
