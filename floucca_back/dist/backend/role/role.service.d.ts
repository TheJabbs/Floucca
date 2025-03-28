import { PrismaService } from "../../prisma/prisma.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "./interfaces/role.interface";
export declare class RoleService {
    private prisma;
    constructor(prisma: PrismaService);
    validateRole(role_code: string): Promise<boolean>;
    createRole(createRoleDto: CreateRoleDto): Promise<Role>;
    findAllRoles(): Promise<Role[]>;
    findRoleById(role_id: number): Promise<Role | null>;
    updateRole(role_id: number, updateRoleDto: CreateRoleDto): Promise<Role>;
    deleteRole(role_id: number): Promise<Role>;
}
