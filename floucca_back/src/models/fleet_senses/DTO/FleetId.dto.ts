import {IsNumber, IsPositive} from "class-validator";

export class FleetIdDto {
    @IsPositive()
    @IsNumber()
    fleet_senses_id: number
}