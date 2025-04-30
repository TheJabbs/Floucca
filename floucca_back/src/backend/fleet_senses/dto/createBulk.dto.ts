import {IsArray, IsInt, IsPositive, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {FormGearUsageDto} from "../../gear_usage/dto/form_gear_usage.dto";
import {CreateFormDto} from "../../form/dto/create_form.dto";

export class CreateBulkDto{
    @ValidateNested()
    @Type(() => CreateFormDto)
    formDto: CreateFormDto;

    @ValidateNested({ each: true })
    @Type(() => FormGearUsageDto)
    gearUsageDto : FormGearUsageDto;

    @IsInt()
    @IsPositive()
    numberOfGears: number;

}