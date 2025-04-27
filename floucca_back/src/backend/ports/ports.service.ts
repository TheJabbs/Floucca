import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePortDto } from './dto/create_port.dto';
import { Port } from './interfaces/port.interface';
import { PortDetailed } from './interfaces/port-detailed.interface';
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
    await this.validatePortData(updatePortDto); 

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

  async getAllPortDetailed(): Promise<PortDetailed[]> {
    const ports = await this.prisma.ports.findMany({
      select: {
        port_id: true,
        port_name: true,
        coop: {
          select: {
            coop_code: true,
            coop_name: true,
            region: {
              select: {
                region_code: true,
                region_name: true,
              },
            },
          },
        },
      },
      orderBy: {
        port_name: 'asc', 
      },
    });
  
    if (ports.length === 0) {
      throw new NotFoundException('No ports found');
    }
  
    return ports;
  }
}