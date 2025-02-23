import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePortDto } from './dto/CreatePort.dto';
import { Port } from './interfaces/port.interface';

@Injectable()
export class PortsService {
  constructor(private prisma: PrismaService) {}

  async create(createPortDto: CreatePortDto): Promise<Port> {
    const coopExists = await this.prisma.coop.findUnique({
        where: { coop_code: createPortDto.coop_code },
    });

    if (!coopExists) {
        throw new Error(`Coop with code ${createPortDto.coop_code} does not exist.`);
    }

    return this.prisma.ports.create({
      data: createPortDto,
    });
  }

  async findAll(): Promise<Port[]> {
    return this.prisma.ports.findMany();
  }

  async findOne(id: number): Promise<Port | null> {
    return this.prisma.ports.findUnique({
      where: { port_id: id },
    });
  }

  async update(id: number, updatePortDto: CreatePortDto): Promise<Port> {
    return this.prisma.ports.update({
      where: { port_id: id },
      data: updatePortDto,
    });
  }

  async remove(id: number): Promise<Port> {
    return this.prisma.ports.delete({
      where: { port_id: id },
    });
  }
}
