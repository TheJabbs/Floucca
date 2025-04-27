import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PortsService } from './ports.service';
import { CreatePortDto } from './dto/create_port.dto';
import { idDTO } from '../../shared/dto/id.dto';
import { Port } from './interfaces/port.interface';
import { PortDetailed } from './interfaces/port-detailed.interface';

@Controller('api/dev/ports')
export class PortsController {
  constructor(private readonly portsService: PortsService) {}

  @Post()
  async create(@Body() createPortDto: CreatePortDto): Promise<Port> {
    console.log('Received request:', createPortDto);
    return this.portsService.createPort(createPortDto);
  }

  @Get()
  async findAll(): Promise<Port[]> {
    return this.portsService.getAllPorts();
  }

  @Get('detailed')
  async getAllPortsDetailed(): Promise<PortDetailed[]> {
    return this.portsService.getAllPortDetailed();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Port> {
    return this.portsService.getPortById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updatePortDto: CreatePortDto): Promise<Port> {
    return this.portsService.updatePort(id, updatePortDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<Port> {
    return this.portsService.deletePort(id);
  }
}
