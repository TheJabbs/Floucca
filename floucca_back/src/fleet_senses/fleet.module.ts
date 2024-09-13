import {Module} from "@nestjs/common";
import {FleetService} from "./fleet.service";

@Module({
    imports: [],
    controllers: [],
    providers: [FleetService],
})
export class FleetModule{}