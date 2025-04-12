import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-users.dto";
import { CreateUserWithDetailsDto } from "./dto/createUserWithDetails.dto";
import { User } from "./interfaces/users.interface";
import { ResponseMessage } from "src/shared/interface/response.interface";
import * as bcrypt from "bcrypt";
import { BadRequestException } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async validateUser(user_id: number): Promise<boolean> {
    const user = await this.prisma.users.findUnique({ where: { user_id } });
    return !!user;
  }

  async createUserWithDetails(
    input: CreateUserWithDetailsDto
  ): Promise<ResponseMessage<{ user_id: number }>> {
    const { coop_codes=[], role_ids=[], ...user } = input;

    if (user.user_email) {
      const existingEmail = await this.prisma.users.findUnique({
        where: { user_email: user.user_email },
      });
      if (existingEmail) {
        throw new BadRequestException("Email already exists.");
      }
    }

    if (user.user_phone) {
      const existingPhone = await this.prisma.users.findUnique({
        where: { user_phone: user.user_phone },
      });
      if (existingPhone) {
        throw new BadRequestException("Phone number already exists.");
      }
    }

    const hashedPassword = await bcrypt.hash(user.user_pass, 10);

    return await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.users.create({
        data: {
          ...user,
          user_pass: hashedPassword,
        },
      });

      const coopPromises = coop_codes.map(async (code) => {
        const coopExists = await tx.coop.findUnique({
          where: { coop_code: code },
        });
        if (!coopExists) {
          throw new BadRequestException(`Coop code ${code} does not exist.`);
        }
        return tx.user_coop.create({
          data: {
            user_id: newUser.user_id,
            coop_code: code,
          },
        });
      });

      const rolePromises = role_ids.map(async (roleId) => {
        const roleExists = await tx.roles.findUnique({
          where: { role_id: roleId },
        });
        if (!roleExists) {
          throw new BadRequestException(`Role ID ${roleId} does not exist.`);
        }
        return tx.user_role.create({
          data: {
            user_id: newUser.user_id,
            role_id: roleId,
          },
        });
      });

      await Promise.all([...coopPromises, ...rolePromises]);

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
