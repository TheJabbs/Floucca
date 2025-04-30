import {CreateFormDto} from "../../form/dto/create_form.dto";
import {CreateBoatDetailsDto} from "../../boat_details/dto/create_boatDetails.dto";
import {CreateGearUsageDto} from "../../gear_usage/dto/create_gear_usage.dto";


export interface SenseFormContentInterface{
    form: CreateFormDto;
    boatDetails: CreateBoatDetailsDto;
    gearUsage: CreateGearUsageDto [];
}