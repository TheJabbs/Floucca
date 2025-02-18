import {Module} from "@nestjs/common";
import {FleetService} from "./fleet.service";
import {FleetController} from "./fleet.controller";
import {FleetTesterController} from "./test/fleet.test";

@Module({
    imports: [],
    controllers: [FleetController, FleetTesterController],
    providers: [FleetService],
})
export class FleetModule{}