import { Module } from '@nestjs/common';
import {PrismaModule} from "./prisma/prisma.module";
import {CoopModule} from "./coop/coop.module";
import {BoatDetailsModule} from "./boat_details/boat_detail.module";
import {EffortTodayModule} from "./effort_today/effort_today.module";
import {FishModule} from "./fish/fish.module";

@Module({
  imports: [PrismaModule, CoopModule, BoatDetailsModule, EffortTodayModule, FishModule],
  providers: [],
})
export class AppModule {}
