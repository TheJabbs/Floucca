import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/backend/users/dto/create-users.dto";
import { LoginUserDto } from "src/backend/users/dto/login-user.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: CreateUserDto): Promise<{
        access_token: string;
    }>;
    login(loginDto: LoginUserDto): Promise<{
        access_token: string;
    }>;
}
