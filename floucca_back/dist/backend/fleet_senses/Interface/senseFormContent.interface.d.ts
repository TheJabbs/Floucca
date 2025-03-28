import { CreateFormDto } from "../../form/DTO";
import { CreateBoatDetailsDto } from "../../boat_details/dto";
import { CreateGearUsageDto } from "../../gear_usage/DTO";
export interface SenseFormContentInterface {
    form: CreateFormDto;
    boatDetails: CreateBoatDetailsDto;
    gearUsage: CreateGearUsageDto[];
}
