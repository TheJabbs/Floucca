
import {FormGearUsageDto} from "../../gear_usage/dto/form_gear_usage.dto";
import {Type} from "class-transformer";
import {IsArray, ValidateNested} from "class-validator";
import {CreateFormDto} from "../../form/dto/create_form.dto";
import {CreateBoatDetailsDto} from "../../boat_details/dto/create_boatDetails.dto";

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