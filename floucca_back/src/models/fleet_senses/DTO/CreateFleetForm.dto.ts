import {CreateFormDto} from "../../form/DTO";
import {CreateFleetDto} from "./CreateFleet.dto";
import {CreateBoatDetailsDto} from "../../boat_details/dto";
import {FormGearUsageDto} from "../../gear_usage/DTO/FormGearUsage.dto";

export class CreateFleetFormDto{
    formDto: CreateFormDto;
    senseDto: CreateFleetDto;
    boatDetailDto: CreateBoatDetailsDto;
    gearUsageDto : FormGearUsageDto [];
}