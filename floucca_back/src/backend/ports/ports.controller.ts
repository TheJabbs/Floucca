import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {PortsService} from './ports.service';
import {CreatePortDto} from './dto/create_port.dto';
import {Port} from './interfaces/port.interface';
import {PortDetailed} from './interfaces/port-detailed.interface';
import {Roles} from "../../auth/decorators/roles.decorator";
import {RoleEnum} from "../../auth/enums/role.enum";
import {RolesGuard} from "../../auth/guards/roles.guard";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";

@Controller('api/dev/ports')
export class PortsController {
    constructor(private readonly portsService: PortsService) {
    }

    @Post()
    async create(@Body() createPortDto: CreatePortDto): Promise<Port> {
        console.log('Received request:', createPortDto);
        return this.portsService.createPort(createPortDto);
    }

    @Get()
    @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
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
