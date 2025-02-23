import { Module } from '@nestjs/common';
import { PortsService } from './ports.service';
import { PortsController } from './ports.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PortsController],
  providers: [PortsService, PrismaService],
  exports: [PortsService],
})
export class PortsModule {}
