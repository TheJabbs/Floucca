import { CreateFormDto } from '../../form/dto';
import { CreateBoatDetailsDto } from '../../boat_details/dto';
import { CreateLandingDto } from './create_landings.dto';
import { CreateFishDto } from '../../fish/dto/create_fish.dto';
import { CreateEffortTodayDto } from '../../effort_today/dto/effort_today.dto';
import { CreateGearDetailDto } from '../../gear_detail/dto/create_gear_detail.dto';
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
