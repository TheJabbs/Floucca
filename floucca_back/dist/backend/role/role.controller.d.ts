import { RoleService } from "./role.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { idDTO } from "../../shared/dto/id.dto";
import { Role } from "./interfaces/role.interface";
export declare class RoleController {
    private readonly roleService;
    constructor(roleService: RoleService);
    createRole(createRoleDto: CreateRoleDto): Promise<Role>;
    findAllRoles(): Promise<Role[]>;
    findRoleById(params: idDTO): Promise<Role | null>;
    updateRole(params: idDTO, updateRoleDto: CreateRoleDto): Promise<Role>;
    deleteRole(role_id: string): Promise<Role>;
}
