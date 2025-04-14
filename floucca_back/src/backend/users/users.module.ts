import { Module } from "@nestjs/common";
import { UserService } from "./users.service";
import { UserController } from "./users.controller";
import { PrismaService } from "../../prisma/prisma.service";
import { UserCoopModule } from '../user_coop/user_coop.module';
import { UserRoleModule } from '../user_role/user_role.module';

@Module({
  imports: [UserCoopModule, UserRoleModule], 
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
