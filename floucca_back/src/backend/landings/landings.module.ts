import {Module} from "@nestjs/common";
import {LandingsController} from "./landings.controller";
import {LandingsService} from "./landings.service";
import {FishModule} from "../fish/fish.module";
import {SenseLastwModule} from "../sense_lastw/sense_lastw.module";

@Module({
    imports: [],
    controllers: [LandingsController],
    providers: [LandingsService, FishModule, SenseLastwModule],
})
export class LandingsModule {}