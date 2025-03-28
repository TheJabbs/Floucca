import { CreateFormDto } from "../../form/DTO";
import { CreateBoatDetailsDto } from "../../boat_details/dto";
import { FormGearUsageDto } from "../../gear_usage/DTO/FormGearUsage.dto";
export declare class CreateFleetFormDto {
    formDto: CreateFormDto;
    boatDetailDto: CreateBoatDetailsDto;
    gearUsageDto: FormGearUsageDto[];
}
