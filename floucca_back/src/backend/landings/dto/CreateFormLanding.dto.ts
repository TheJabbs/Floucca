import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateFormDto } from '../../form/DTO';
import { CreateBoatDetailsDto } from '../../boat_details/dto';
import { CreateLandingDto } from './createLandings.dto';
import { CreateFishDto } from '../../fish/dto/create_fish.Dto';
import { CreateEffortTodayDto } from '../../effort_today/dto/effort_today.Dto';
import { CreateGearDetailDto } from '../../gear_detail/dto/CreateGearDetail.dto';
import { CreateSenseLastwDto } from '../../sense_lastw/dto/create-sense_lastw.dto';

export class CreateFormLandingDto {
    @ValidateNested()
    @Type(() => CreateFormDto)
    form: CreateFormDto;

    @ValidateNested()
    @Type(() => CreateBoatDetailsDto)
    boat_details: CreateBoatDetailsDto;

    @ValidateNested()
    @Type(() => CreateLandingDto)
    landing: CreateLandingDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateFishDto)
    fish: CreateFishDto[];

    @ValidateNested()
    @Type(() => CreateEffortTodayDto)
    effort: CreateEffortTodayDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateGearDetailDto)
    gearDetail: CreateGearDetailDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSenseLastwDto)
    lastw: CreateSenseLastwDto[];
}