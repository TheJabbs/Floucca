import { CreateFormDto } from "../../form/dto";
import { CreateBoatDetailsDto } from "../../boat_details/dto";
import { CreateGearUsageDto } from "../../gear_usage/dto";
export interface SenseFormContentInterface {
    form: CreateFormDto;
    boatDetails: CreateBoatDetailsDto;
    gearUsage: CreateGearUsageDto[];
}
