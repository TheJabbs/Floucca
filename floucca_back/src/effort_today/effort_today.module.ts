import {Module} from "@nestjs/common";
import {EffortTodayController} from "./effort_today.controller";
import {EffortTodayService} from "./effort_today.service";

@Module({
    imports: [],
    controllers: [EffortTodayController],
    providers: [EffortTodayService],
})
export class EffortTodayModule{}