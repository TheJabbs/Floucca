import {IsInt, IsNotEmpty, IsNumber, IsString} from "class-validator";

export class CreateBoatDetailDto {
    @IsNotEmpty()
    @IsString()
    fleet_owner: string;
    @IsNotEmpty()
    @IsNumber()
    fleet_size?: number;
    @IsNotEmpty()
    @IsNumber()
    fleet_crew?: number;
    @IsNotEmpty()
    @IsNumber()
    fleet_max_weigh?: number;
    @IsNotEmpty()
    @IsNumber()
    fleet_length?: number;
    @IsNotEmpty()
    @IsNumber()
    fleet_registration: number;
}