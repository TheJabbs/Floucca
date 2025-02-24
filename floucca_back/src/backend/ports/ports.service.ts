import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePortDto } from './dto/CreatePort.dto';
import { Port } from './interfaces/port.interface';

@Injectable()
export class PortsService {
  constructor(private prisma: PrismaService) {}

  private async validatePortData(portDto: CreatePortDto): Promise<void> {
    const coopExists = await this.prisma.coop.findUnique({
      where: { coop_code: portDto.coop_code },
    });

    if (!coopExists) {
      throw new BadRequestException(`Coop with code ${portDto.coop_code} does not exist.`);
    }
  }

  async createPort(createPortDto: CreatePortDto): Promise<Port> {
    await this.validatePortData(createPortDto); // Validate before creating

    return this.prisma.ports.create({
      data: createPortDto,
    });
  }

  async getAllPorts(): Promise<Port[]> {
    return this.prisma.ports.findMany();
  }

  async getPortById(id: number): Promise<Port> {
    const port = await this.prisma.ports.findUnique({
      where: { port_id: id },
    });

    if (!port) {
      throw new NotFoundException(`Port with ID ${id} not found.`);
    }

    return port;
  }

  async updatePort(id: number, updatePortDto: CreatePortDto): Promise<Port> {
    await this.validatePortData(updatePortDto); // Validate before updating

    return this.prisma.ports.update({
      where: { port_id: id },
      data: updatePortDto,
    });
  }

  async deletePort(id: number): Promise<Port> {
    return this.prisma.ports.delete({
      where: { port_id: id },
    });
  }
}
