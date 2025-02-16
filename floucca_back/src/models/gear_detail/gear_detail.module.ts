import {Module} from "@nestjs/common";
import {GearDetailController} from "./gear_detail.controller";
import {GearDetailService} from "./gear_detail.service";
import {EffortTodayService} from "../effort_today/effort_today.service";
import {GearService} from "../gear/gear.service";

@Module({
    imports: [],
    controllers: [GearDetailController],
    providers: [GearDetailService, EffortTodayService, GearService],
})
export class GearDetailModule {}
