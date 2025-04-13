import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-users.dto";
import { CreateUserWithDetailsDto } from "./dto/createUserWithDetails.dto";
import { User } from "./interfaces/users.interface";
import { ResponseMessage } from "src/shared/interface/response.interface";
import * as bcrypt from "bcrypt";
import { BadRequestException } from "@nestjs/common";
import { UserCoopService } from "../user_coop/user_coop.service";
import { UserRoleService } from "../user_role/user_role.service";
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService,
    private readonly userCoopService: UserCoopService,
    private readonly userRoleService: UserRoleService
  ) {}

  async validateUser(user_id: number): Promise<boolean> {
    const user = await this.prisma.users.findUnique({ where: { user_id } });
    return !!user;
  }

  async createUserWithDetails(
    input: CreateUserWithDetailsDto
  ): Promise<ResponseMessage<{ user_id: number }>> {
    const {
      user_fname,
      user_lname,
      user_email,
      user_phone,
      user_pass,
      coop_codes = [],
      role_ids = [],
    } = input;

    // Email/Phone validations
    if (user_email) {
      const existingEmail = await this.prisma.users.findUnique({ where: { user_email } });
      if (existingEmail) throw new BadRequestException("Email already exists.");
    }

    if (user_phone) {
      const existingPhone = await this.prisma.users.findUnique({ where: { user_phone } });
      if (existingPhone) throw new BadRequestException("Phone number already exists.");
    }

    const hashedPassword = await bcrypt.hash(user_pass, 10);

    // Transaction block
    return await this.prisma.$transaction(async (tx) => {
      // 1. Create the user
      const newUser = await tx.users.create({
        data: {
          user_fname,
          user_lname,
          user_email,
          user_phone,
          user_pass: hashedPassword,
        },
      });

      // 2. Add entries to user_coop table using the service
      await Promise.all(
        coop_codes.map(async (coop_code) => {
          await this.userCoopService.createUserCoop({
            user_id: newUser.user_id,
            coop_code,
          });
        })
      );

      // 3. Add entries to user_role table using the service
      await Promise.all(
        role_ids.map(async (role_id) => {
          await this.userRoleService.createUserRole({
            user_id: newUser.user_id,
            role_id,
          });
        })
      );

      return {
        message: `User ${newUser.user_fname} ${newUser.user_lname} created successfully.`,
        data: { user_id: newUser.user_id },
      };
    });
  }


  async findAllUsers(): Promise<User[]> {
    return this.prisma.users.findMany();
  }

  async findUserById(user_id: number): Promise<User | null> {
    return this.prisma.users.findUnique({ where: { user_id } });
  }

  async updateUser(user_id: number, updateUserDto: CreateUserDto): Promise<User> {
    const userExists = await this.validateUser(user_id);
    if (!userExists) {
      throw new NotFoundException(`User with ID ${user_id} not found.`);
    }

    return this.prisma.users.update({
      where: { user_id },
      data: updateUserDto,
    });
  }

  async updateLastLogin(user_id: number): Promise<User> {
    return this.prisma.users.update({
      where: { user_id },
      data: { last_login: new Date() },
    });
  }

  async deleteUser(user_id: number): Promise<User> {
    const userExists = await this.validateUser(user_id);
    if (!userExists) {
      throw new NotFoundException(`User with ID ${user_id} not found.`);
    }

    return this.prisma.users.delete({
      where: { user_id },
    });
  }


}
