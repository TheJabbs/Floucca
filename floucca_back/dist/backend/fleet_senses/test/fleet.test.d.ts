import { FleetService } from "../fleet.service";
import { FormGearUsageDto } from "../../gear_usage/DTO/FormGearUsage.dto";
export declare class FleetTesterController {
    private readonly fleetService;
    constructor(fleetService: FleetService);
    createSenseForm(test: FormGearUsageDto[]): Promise<void>;
}
