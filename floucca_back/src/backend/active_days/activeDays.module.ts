import {Module} from "@nestjs/common";
import {ActiveDaysController} from "./activeDays.controller";
import {ActiveDaysService} from "./activeDays.service";

@Module({
    imports: [],
    controllers: [ActiveDaysController],
    providers: [ActiveDaysService],
    exports: [ActiveDaysService],
})
export class ActiveDaysModule {}