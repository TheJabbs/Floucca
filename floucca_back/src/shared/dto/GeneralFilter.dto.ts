import {IsArray, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString} from "class-validator";

export class GeneralFilterDto {
    @IsDate()
    period: Date;

    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    @IsPositive(({each: true}))
    gear_code?: number[];

    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    @IsPositive(({each: true}))
    port_id?:  number[];

    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    @IsPositive(({each: true}))
    coop?:  number[];

    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    @IsPositive(({each: true}))
    region?:  number[];


}