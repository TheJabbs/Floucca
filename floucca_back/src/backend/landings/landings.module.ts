import {Module} from "@nestjs/common";
import {LandingsController} from "./landings.controller";
import {LandingsService} from "./landings.service";
import {FishService} from "../fish/fish.service";

@Module({
    imports: [],
    controllers: [LandingsController],
    providers: [LandingsService, FishService],
})
export class LandingsModule {}