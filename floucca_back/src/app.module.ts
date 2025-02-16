import { Module } from '@nestjs/common';
import {PrismaModule} from "./prisma/prisma.module";
import {CoopModule} from "./models/coop/coop.module";
import {BoatDetailsModule} from "./models/boat_details/boat_detail.module";
import {EffortTodayModule} from "./models/effort_today/effort_today.module";
import {FishModule} from "./models/fish/fish.module";
import {FleetModule} from "./models/fleet_senses/fleet.module";
import {FormModule} from "./models/form/form.module";
import {GearModule} from "./models/gear/gear.module";
import {GearUsageModule} from "./models/gear_usage/gear_usage.module";
import {GearDetailService} from "./models/gear_detail/gear_detail.service";
import {GearDetailModule} from "./models/gear_detail/gear_detail.module";
import {ScheduleModule} from "./auto/schedule.module";


@Module({
  imports: [PrismaModule, CoopModule, BoatDetailsModule,
    EffortTodayModule, FishModule, FishModule, FleetModule,
    FormModule, GearModule, GearUsageModule, GearDetailModule,
  ScheduleModule],
  providers: [],
})
export class AppModule {}
