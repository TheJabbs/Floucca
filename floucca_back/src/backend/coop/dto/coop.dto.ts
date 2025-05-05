import {IsInt, IsNotEmpty} from "class-validator";
export class CoopDto {
    @IsNotEmpty()
    @IsInt()
    coop_code: number;
    @IsNotEmpty()
    @IsInt()
    region_code: number;
    @IsNotEmpty()
    coop_name: string;
}