import { PortsService } from './ports.service';
import { CreatePortDto } from './dto/CreatePort.dto';
import { idDTO } from '../../shared/dto/id.dto';
import { Port } from './interfaces/port.interface';
export declare class PortsController {
    private readonly portsService;
    constructor(portsService: PortsService);
    create(createPortDto: CreatePortDto): Promise<Port>;
    findAll(): Promise<Port[]>;
    findOne(params: idDTO): Promise<Port>;
    update(params: idDTO, updatePortDto: CreatePortDto): Promise<Port>;
    remove(params: idDTO): Promise<Port>;
}
