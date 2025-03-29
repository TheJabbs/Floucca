import { UserCoopService } from "./user_coop.service";
import { CreateUserCoopDto } from "./dto/create-user_coop.dto";
import { idDTO } from "../../shared/dto/id.dto";
import { UserCoop } from "./interfaces/user_coop.interface";
export declare class UserCoopController {
    private readonly userCoopService;
    constructor(userCoopService: UserCoopService);
    createUserCoop(createUserCoopDto: CreateUserCoopDto): Promise<UserCoop>;
    findAllUserCoops(): Promise<UserCoop[]>;
    findUserCoopById(user_coop_id: string): Promise<UserCoop | null>;
    updateUserCoop(params: idDTO, updateUserCoopDto: CreateUserCoopDto): Promise<UserCoop>;
    deleteUserCoop(user_coop_id: string): Promise<UserCoop>;
}
