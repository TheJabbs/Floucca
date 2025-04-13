import { Module } from "@nestjs/common";
import { UserCoopService } from "./user_coop.service";
import { UserCoopController } from "./user_coop.controller";
import { PrismaService } from "../../prisma/prisma.service";

@Module({
  controllers: [UserCoopController],
  providers: [UserCoopService, PrismaService],
  exports: [UserCoopService], 
})
export class UserCoopModule {}
