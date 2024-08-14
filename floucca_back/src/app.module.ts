import { Module } from '@nestjs/common';
import {PrismaModule} from "./prisma/prisma.module";
import {CoopModule} from "./coop/coop.module";

@Module({
  imports: [PrismaModule, CoopModule],
  providers: [],
})
export class AppModule {}
