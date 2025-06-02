import { Module } from "@nestjs/common";
import { UserService } from "./users.service";
import { UserController } from "./users.controller";
import { PrismaService } from "../../prisma/prisma.service";
import { UserCoopModule } from '../user_coop/user_coop.module';
import { UserRoleModule } from '../user_role/user_role.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {FormModule} from "../form/form.module";
import {AuthModule} from "../../auth/auth.module";
@Module({
  imports: [UserCoopModule, UserRoleModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, 
    PrismaService, 
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },],
})
export class UserModule {}
