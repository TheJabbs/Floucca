import {
    IsArray,
    IsDateString,
    IsInt, IsNotEmpty,
    IsOptional,
    IsPositive
} from "class-validator";
import {Transform} from "class-transformer";

export class GeneralFilterDto {
    @IsDateString()
    @IsNotEmpty()
    @Transform(({ value }) => new Date(value).toISOString())
    period: string;

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

    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    @IsPositive(({each: true}))
    specie_code?: number[];


}