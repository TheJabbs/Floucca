import {IsArray, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString} from "class-validator";

export class EffortFilterDto {
    @IsDate()
    period: Date;

    @IsArray()
    @IsInt({each: true})
    @IsPositive(({each: true}))
    @IsOptional()
    gear_code?: number[];

    @IsArray()
    @IsInt({each: true})
    @IsPositive(({each: true}))
    port_id:  number[];


}