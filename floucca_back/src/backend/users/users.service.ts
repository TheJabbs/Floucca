import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-users.dto";
import { User } from "./interfaces/users.interface";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async validateUser(user_id: number): Promise<boolean> {
    const user = await this.prisma.users.findUnique({ where: { user_id } });
    return !!user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    console.log("Received user data:", createUserDto);

    return this.prisma.users.create({
      data: createUserDto,
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
