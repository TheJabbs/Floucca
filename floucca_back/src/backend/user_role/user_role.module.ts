import { Module } from "@nestjs/common";
import { UserRoleService } from "./user_role.service";
import { UserRoleController } from "./user_role.controller";
import { PrismaService } from "../../prisma/prisma.service";

@Module({
  controllers: [UserRoleController],
  providers: [UserRoleService, PrismaService],
})
export class UserRoleModule {}
