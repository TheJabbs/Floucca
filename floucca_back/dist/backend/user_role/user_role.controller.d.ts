import { UserRoleService } from "./user_role.service";
import { CreateUserRoleDto } from "./dto/create-user_role.dto";
import { idDTO } from "../../shared/dto/id.dto";
import { UserRole } from "./interfaces/user_role.interface";
export declare class UserRoleController {
    private readonly userRoleService;
    constructor(userRoleService: UserRoleService);
    createUserRole(createUserRoleDto: CreateUserRoleDto): Promise<UserRole>;
    findAllUserRoles(): Promise<UserRole[]>;
    findUserRoleById(params: idDTO): Promise<UserRole | null>;
    updateUserRole(params: idDTO, updateUserRoleDto: CreateUserRoleDto): Promise<UserRole>;
    deleteUserRole(user_role_id: string): Promise<UserRole>;
}
