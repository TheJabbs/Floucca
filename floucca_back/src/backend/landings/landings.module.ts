import {Module} from "@nestjs/common";
import {LandingsController} from "./landings.controller";
import {LandingsService} from "./landings.service";

@Module({
    imports: [],
    controllers: [LandingsController],
    providers: [LandingsService],
    exports: [LandingsService]
})
export class LandingsModule {}