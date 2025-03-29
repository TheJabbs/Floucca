import { CreateFormDto } from "../../form/dto";
import { CreateBoatDetailsDto } from "../../boat_details/dto";
import { FormGearUsageDto } from "../../gear_usage/dto/FormGearUsage.dto";
export declare class CreateFleetFormDto {
    formDto: CreateFormDto;
    boatDetailDto: CreateBoatDetailsDto;
    gearUsageDto: FormGearUsageDto[];
}
