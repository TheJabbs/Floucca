import { Module } from "@nestjs/common";
import { SpecieService } from "./species.service";
import { SpecieController } from "./species.controller";
import { PrismaService } from "../../prisma/prisma.service";

@Module({
  controllers: [SpecieController],
  providers: [SpecieService, PrismaService],
})
export class SpecieModule {}