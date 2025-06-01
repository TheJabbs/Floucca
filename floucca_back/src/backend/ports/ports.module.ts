import { Module } from '@nestjs/common';
import { PortsService } from './ports.service';
import { PortsController } from './ports.controller';
import { PrismaService } from '../../prisma/prisma.service';
import {AuthModule} from "../../auth/auth.module";
import {PassportModule} from "@nestjs/passport";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  controllers: [PortsController],
  providers: [PortsService, PrismaService],
  exports: [PortsService],
})
export class PortsModule {}
