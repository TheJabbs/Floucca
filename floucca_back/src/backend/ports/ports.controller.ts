import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { PortsService } from './ports.service';
import { CreatePortDto } from './dto/CreatePort.dto';
import { idDTO } from '../../shared/dto/id.dto';
import { Port } from './interfaces/port.interface';

@Controller('ports')
export class PortsController {
  constructor(private readonly portsService: PortsService) {}

  @Post()
  async create(@Body() createPortDto: CreatePortDto): Promise<Port> {
    console.log('Received request:', createPortDto); // Log request data
    return this.portsService.create(createPortDto);
  }

  @Get()
  async findAll(): Promise<Port[]> {
    return this.portsService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: idDTO): Promise<Port> {
    return this.portsService.findOne(params.id);
  }

  @Put(':id')
  async update(@Param() params: idDTO, @Body() updatePortDto: CreatePortDto): Promise<Port> {
    return this.portsService.update(params.id, updatePortDto);
  }

  @Delete(':id')
  async remove(@Param() params: idDTO): Promise<Port> {
    return this.portsService.remove(params.id);
  }
}
