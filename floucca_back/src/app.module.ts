import { Module } from '@nestjs/common';
import {PrismaModule} from "./prisma/prisma.module";
import {CoopModule} from "./models/coop/coop.module";
import {BoatDetailsModule} from "./models/boat_details/boat_detail.module";
import {EffortTodayModule} from "./models/effort_today/effort_today.module";
import {FishModule} from "./models/fish/fish.module";


@Module({
  imports: [PrismaModule, CoopModule, BoatDetailsModule, EffortTodayModule, FishModule],
  providers: [],
})
export class AppModule {}
