import {Body, Controller, Post} from "@nestjs/common";
import {FleetService} from "../fleet.service";
import {FormGearUsageDto} from "../../gear_usage/DTO/FormGearUsage.dto";
import {transformFormGearUsageToGearUsage} from "../../../utils/transformation/formGearUsageToGearUsage.mapper";

@Controller('api/dev/test/fleet_senses')
export class FleetTesterController {
    constructor(private readonly fleetService: FleetService) {
    }

    @Post("/gu")
    async createSenseForm(@Body() test: FormGearUsageDto[]){
        const tester = transformFormGearUsageToGearUsage(test);
        console.log(tester);
    }
}