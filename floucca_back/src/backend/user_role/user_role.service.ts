import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserRoleDto } from "./dto/create-user_role.dto";
import { UserRole } from "./interfaces/user_role.interface";

@Injectable()
export class UserRoleService {
  constructor(private prisma: PrismaService) {}

  async validateUserRole(user_id: number, role_id: number): Promise<boolean> {
    const userExists = await this.prisma.users.findUnique({ where: { user_id } });
    const roleExists = await this.prisma.roles.findUnique({ where: { role_id } });

    if (!userExists) {
      throw new BadRequestException(`User with ID ${user_id} does not exist.`);
    }
    if (!roleExists) {
      throw new BadRequestException(`Role with ID ${role_id} does not exist.`);
    }
    return true;
  }

  async createUserRole(createUserRoleDto: CreateUserRoleDto): Promise<UserRole> {
    console.log("Creating User Role:", createUserRoleDto);
    const { user_id, role_id } = createUserRoleDto;

    await this.validateUserRole(user_id, role_id);

    return this.prisma.user_role.create({
      data: createUserRoleDto,
    });
  }

  async findAllUserRoles(): Promise<UserRole[]> {
    return this.prisma.user_role.findMany();
  }

  async findUserRoleById(user_role_id: number): Promise<UserRole | null> {
    return this.prisma.user_role.findUnique({
      where: { user_role_id },
    });
  }

  async updateUserRole(user_role_id: number, updateUserRoleDto: CreateUserRoleDto): Promise<UserRole> {
    console.log("Updating User Role:", { user_role_id, ...updateUserRoleDto });

    const userRoleExists = await this.findUserRoleById(user_role_id);
    if (!userRoleExists) {
      throw new NotFoundException(`User Role with ID ${user_role_id} not found.`);
    }

    await this.validateUserRole(updateUserRoleDto.user_id, updateUserRoleDto.role_id);

    return this.prisma.user_role.update({
      where: { user_role_id },
      data: updateUserRoleDto,
    });
  }

  async deleteUserRole(user_role_id: number): Promise<UserRole> {
    console.log("Deleting User Role ID:", user_role_id);

    const userRoleExists = await this.findUserRoleById(user_role_id);
    if (!userRoleExists) {
      throw new NotFoundException(`User Role with ID ${user_role_id} not found.`);
    }

    return this.prisma.user_role.delete({
      where: { user_role_id },
    });
  }
}
