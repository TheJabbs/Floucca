import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserRoleDto } from "./dto/create-user_role.dto";
import { UserRole } from "./interfaces/user_role.interface";
export declare class UserRoleService {
    private prisma;
    constructor(prisma: PrismaService);
    validateUserRole(user_id: number, role_id: number): Promise<boolean>;
    createUserRole(createUserRoleDto: CreateUserRoleDto): Promise<UserRole>;
    findAllUserRoles(): Promise<UserRole[]>;
    findUserRoleById(user_role_id: number): Promise<UserRole | null>;
    updateUserRole(user_role_id: number, updateUserRoleDto: CreateUserRoleDto): Promise<UserRole>;
    deleteUserRole(user_role_id: number): Promise<UserRole>;
}
