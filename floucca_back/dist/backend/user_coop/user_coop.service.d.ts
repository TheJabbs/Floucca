import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserCoopDto } from "./dto/create-user_coop.dto";
import { UserCoop } from "./interfaces/user_coop.interface";
export declare class UserCoopService {
    private prisma;
    constructor(prisma: PrismaService);
    validateUserCoop(user_id: number, coop_code: number): Promise<boolean>;
    createUserCoop(createUserCoopDto: CreateUserCoopDto): Promise<UserCoop>;
    findAllUserCoops(): Promise<UserCoop[]>;
    findUserCoopById(user_coop_id: number): Promise<UserCoop | null>;
    updateUserCoop(user_coop_id: number, updateUserCoopDto: CreateUserCoopDto): Promise<UserCoop>;
    deleteUserCoop(user_coop_id: number): Promise<UserCoop>;
}
