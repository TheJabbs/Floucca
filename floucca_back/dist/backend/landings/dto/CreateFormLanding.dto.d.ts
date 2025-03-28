import { CreateFormDto } from '../../form/DTO';
import { CreateBoatDetailsDto } from '../../boat_details/dto';
import { CreateLandingDto } from './createLandings.dto';
import { CreateFishDto } from '../../fish/dto/create_fish.Dto';
import { CreateEffortTodayDto } from '../../effort_today/dto/effort_today.Dto';
import { CreateGearDetailDto } from '../../gear_detail/dto/CreateGearDetail.dto';
import { CreateSenseLastwDto } from '../../sense_lastw/dto/create-sense_lastw.dto';
export declare class CreateFormLandingDto {
    form: CreateFormDto;
    boat_details: CreateBoatDetailsDto;
    landing?: CreateLandingDto;
    fish?: CreateFishDto[];
    effort?: CreateEffortTodayDto;
    gearDetail?: CreateGearDetailDto[];
    lastw?: CreateSenseLastwDto[];
}
