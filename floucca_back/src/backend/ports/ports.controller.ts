import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PortsService } from './ports.service';
import { CreatePortDto } from './dto/create_port.dto';
import { idDTO } from '../../shared/dto/id.dto';
import { Port } from './interfaces/port.interface';

@Controller('api/dev/ports')
export class PortsController {
  constructor(private readonly portsService: PortsService) {}

  @Post()
  async create(@Body() createPortDto: CreatePortDto): Promise<Port> {
    console.log('Received request:', createPortDto); // Log request data
    return this.portsService.createPort(createPortDto);
  }

  @Get()
  async findAll(): Promise<Port[]> {
    return this.portsService.getAllPorts();
  }

  @Get(':id')
  async findOne(@Param() params: idDTO): Promise<Port> {
    return this.portsService.getPortById(params.id);
  }

  @Put(':id')
  async update(@Param() params: idDTO, @Body() updatePortDto: CreatePortDto): Promise<Port> {
    return this.portsService.updatePort(params.id, updatePortDto);
  }

  @Delete(':id')
  async remove(@Param() params: idDTO): Promise<Port> {
    return this.portsService.deletePort(params.id);
  }

  @Get()
  async getAllPortsDetailed(){
    return this.portsService.getAllPortDetailed();
  }
}
