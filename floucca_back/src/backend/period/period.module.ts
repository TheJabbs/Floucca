import {Module} from "@nestjs/common";
import {PeriodService} from "./period.service";
import {PeriodController} from "./period.controller";
import {ActiveDaysModule} from "../active_days/activeDays.module";

@Module({
    imports: [ActiveDaysModule],
    controllers: [PeriodController],
    providers: [PeriodService],
})
export class PeriodModule{}