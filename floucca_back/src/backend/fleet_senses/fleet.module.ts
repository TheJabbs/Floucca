import {Module} from "@nestjs/common";
import {FleetService} from "./fleet.service";
import {FleetController} from "./fleet.controller";

@Module({
    imports: [],
    controllers: [FleetController],
    providers: [FleetService],
    exports: [FleetService],
})
export class FleetModule{}