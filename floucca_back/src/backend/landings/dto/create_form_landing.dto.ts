import {IsArray, IsOptional, ValidateNested} from 'class-validator';
import {Type} from 'class-transformer';
import {CreateLandingDto} from './create_landings.dto';
import {CreateFishDto} from '../../fish/dto/create_fish.dto';
import {CreateEffortTodayDto} from '../../effort_today/dto/effort_today.dto';
import {CreateGearDetailDto} from '../../gear_detail/dto/create_gear_detail.dto';
import {CreateSenseLastwDto} from '../../sense_lastw/dto/create-sense_lastw.dto';
import {CreateFormDto} from "../../form/dto/create_form.dto";
import {CreateBoatDetailsDto} from "../../boat_details/dto/create_boatDetails.dto";

export class CreateFormLandingDto {
    @ValidateNested()
    @Type(() => CreateFormDto)
    form: CreateFormDto;

    @ValidateNested()
    @Type(() => CreateBoatDetailsDto)
    boat_details: CreateBoatDetailsDto;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateLandingDto)
    landing?: CreateLandingDto;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => CreateFishDto)
    fish?: CreateFishDto[];

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateEffortTodayDto)
    effort?: CreateEffortTodayDto;

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => CreateGearDetailDto)
    gearDetail?: CreateGearDetailDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => CreateSenseLastwDto)
    lastw?: CreateSenseLastwDto[];
}