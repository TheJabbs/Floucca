import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "src/backend/users/dto/create-users.dto";
import { LoginUserDto } from "src/backend/users/dto/login-user.dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(registerDto: CreateUserDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { user_email: registerDto.user_email },
    });

    if (existingUser) {
      throw new UnauthorizedException("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(registerDto.user_pass, 10);

    const newUser = await this.prisma.users.create({
      data: {
        user_fname: registerDto.user_fname,
        user_lname: registerDto.user_lname,
        user_email: registerDto.user_email,
        user_pass: hashedPassword,
        user_phone: registerDto.user_phone
      },
    });

    return this.generateToken(newUser.user_id);
  }

  async login(loginDto: LoginUserDto) {
    const user = await this.prisma.users.findUnique({
      where: { user_email: loginDto.user_email },
    });

    if (!user || !(await bcrypt.compare(loginDto.user_pass, user.user_pass))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return this.generateToken(user.user_id);
  }

  private generateToken(user_id: number) {
    return {
      access_token: this.jwtService.sign({ user_id }),
    };
  }
}
