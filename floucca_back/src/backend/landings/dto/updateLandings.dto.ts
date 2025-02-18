import {IsDecimal, IsInt, IsOptional, IsPositive} from "class-validator";

export class UpdateLandingsDto {
    @IsOptional()
    @IsInt()
    @IsPositive()
    form_id?: number;
    @IsOptional()
    @IsInt()
    @IsPositive()
    boat_details_id?: number;
    @IsOptional()
    @IsDecimal()
    @IsPositive()
    latitude?: number;
    @IsOptional()
    @IsDecimal()
    @IsPositive()
    longitude?: number;
}
