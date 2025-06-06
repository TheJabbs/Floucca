import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma/prisma.service";
import { LoginUserDto } from "src/backend/users/dto/login-user.dto";
import * as bcrypt from "bcryptjs";
import { UserService } from "src/backend/users/users.service";
import { CreateUserWithDetailsDto } from "src/backend/users/dto/createUserWithDetails.dto";

@Injectable()
export class AuthService {
  constructor(
      private prisma: PrismaService,
      private jwtService: JwtService,
      private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.users.findUnique({
      where: { user_email: email },
      include: {
        user_coop: {
          include: {
            coop: true,
          },
        },
        user_role: {
          include: {
            roles: true,
          },
        },
      },
    });

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.user_pass);
    if (!isPasswordValid) return null;

    return user;
  }

  async register(registerDto: CreateUserWithDetailsDto) {
    const result = await this.userService.createUserWithDetails(registerDto);
    return this.generateToken(result.data.user_id);
  }

  async login(loginDto: LoginUserDto): Promise<{ access_token: string; user: any }> {
    const user = await this.validateUser(loginDto.user_email, loginDto.user_pass);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.generateToken(user.user_id);
    return { access_token: token.access_token, user };
  }

  private async generateToken(user_id: number) {
    const user = await this.userService.getUserWithDetails(user_id);

    const payload = {
      user_id: user.user_id,
      email: user.user_email,
      fname: user.user_fname,
      lname: user.user_lname,
      phone: user.user_phone,
      coops: user.user_coop?.map(c => ({
        coop_code: c.coop.coop_code,
        coop_name: c.coop.coop_name
      })) || [],
      roles: user.user_role?.map(r => r.roles.role_name) || [],
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}