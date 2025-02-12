import {Module} from "@nestjs/common";
import {GearUsageController} from "./gear_usage.controller";
import {GearUsageService} from "./gear_usage.service";

@Module({
    imports: [],
    controllers: [GearUsageController],
    providers: [GearUsageService],
})export class GearUsageModule {}