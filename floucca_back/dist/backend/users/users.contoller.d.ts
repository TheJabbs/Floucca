import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-users.dto";
import { User } from "./interfaces/users.interface";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(createUserDto: CreateUserDto): Promise<User>;
    findAllUsers(): Promise<User[]>;
    findUserById(user_id: string, req: any): Promise<User | null>;
    updateUser(user_id: string, updateUserDto: CreateUserDto): Promise<User>;
    updateLastLogin(user_id: string): Promise<void>;
    deleteUser(user_id: string): Promise<User>;
}
