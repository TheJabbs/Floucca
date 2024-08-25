import { Module } from '@nestjs/common';
import {PrismaModule} from "./prisma/prisma.module";
import {CoopModule} from "./coop/coop.module";
import {BoatDetailModule} from "./boat_details/boat_detail.module";

@Module({
  imports: [PrismaModule, CoopModule, BoatDetailModule],
  providers: [],
})
export class AppModule {}
