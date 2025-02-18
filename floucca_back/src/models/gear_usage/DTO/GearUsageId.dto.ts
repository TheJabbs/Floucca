import {IsNumber, IsPositive} from "class-validator";

export class GearUsageIdDto {
    @IsNumber()
    @IsPositive()
    usage_id: number;
}