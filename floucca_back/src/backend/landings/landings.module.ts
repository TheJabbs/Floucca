import {Module} from "@nestjs/common";
import {LandingsController} from "./landings.controller";
import {LandingsService} from "./landings.service";
import {FormGateway} from "../form/form.gateWay";
import {FormModule} from "../form/form.module";

@Module({
    imports: [FormModule],
    controllers: [LandingsController],
    providers: [LandingsService],
    exports: [LandingsService]
})
export class LandingsModule {}