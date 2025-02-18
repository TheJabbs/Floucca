import { IsInt, IsPositive, IsString, IsDate } from "class-validator";

export class CreateSenseLastwDto {
    @IsString()
    fleet_owner: string;

    @IsPositive()
    @IsInt()
    fleet_size: number;

    @IsPositive()
    @IsInt()
    fleet_crew: number;

    @IsPositive()
    fleet_max_weight: number;

    @IsPositive()
    fleet_length: number;

    @IsString()
    fleet_registration: string;

    @IsDate()
    createdAt: Date;
}
