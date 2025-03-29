import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "src/backend/users/dto/create-users.dto";
import { LoginUserDto } from "src/backend/users/dto/login-user.dto";
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(registerDto: CreateUserDto): Promise<{
        access_token: string;
    }>;
    login(loginDto: LoginUserDto): Promise<{
        access_token: string;
    }>;
    private generateToken;
}
