import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-users.dto";
import { User } from "./interfaces/users.interface";
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    validateUser(user_id: number): Promise<boolean>;
    createUser(createUserDto: CreateUserDto): Promise<User>;
    findAllUsers(): Promise<User[]>;
    findUserById(user_id: number): Promise<User | null>;
    updateUser(user_id: number, updateUserDto: CreateUserDto): Promise<User>;
    updateLastLogin(user_id: number): Promise<User>;
    deleteUser(user_id: number): Promise<User>;
}
