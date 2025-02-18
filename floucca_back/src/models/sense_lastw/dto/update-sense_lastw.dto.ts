import { IsInt, IsPositive, IsString, IsDate } from "class-validator";
import { Optional } from "@nestjs/common";

export class UpdateSenseLastwDto {
    @IsString()
    @Optional()
    fleet_owner?: string;

    @IsPositive()
    @IsInt()
    @Optional()
    fleet_size?: number;

    @IsPositive()
    @IsInt()
    @Optional()
    fleet_crew?: number;

    @IsPositive()
    @Optional()
    fleet_max_weight?: number;

    @IsPositive()
    @Optional()
    fleet_length?: number;

    @IsString()
    @Optional()
    fleet_registration?: string;

    @IsDate()
    @Optional()
    createdAt?: Date;
}
