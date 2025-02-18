import {CreateFormDto} from "../../form/DTO";
import {CreateBoatDetailsDto} from "../../boat_details/dto";
import {FormGearUsageDto} from "../../gear_usage/DTO/FormGearUsage.dto";
import {Type} from "class-transformer";
import {IsArray, ValidateNested} from "class-validator";

export class CreateFleetFormDto{
    @ValidateNested()
    @Type(() => CreateFormDto)
    formDto: CreateFormDto;

    @ValidateNested()
    @Type(() => CreateBoatDetailsDto)
    boatDetailDto: CreateBoatDetailsDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FormGearUsageDto)
    gearUsageDto : FormGearUsageDto [];
}