import {IsNumber, IsPositive} from "class-validator";

export class GearIdDto {
    @IsNumber()
    @IsPositive()
    gear_id: number;
}