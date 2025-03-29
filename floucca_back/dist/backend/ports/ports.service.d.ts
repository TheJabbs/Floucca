import { PrismaService } from '../../prisma/prisma.service';
import { CreatePortDto } from './dto/create_port.dto';
import { Port } from './interfaces/port.interface';
export declare class PortsService {
    private prisma;
    constructor(prisma: PrismaService);
    private validatePortData;
    createPort(createPortDto: CreatePortDto): Promise<Port>;
    getAllPorts(): Promise<Port[]>;
    getPortById(id: number): Promise<Port>;
    updatePort(id: number, updatePortDto: CreatePortDto): Promise<Port>;
    deletePort(id: number): Promise<Port>;
}
