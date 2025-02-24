import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { Role } from "./interfaces/role.interface";

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async validateRole(role_code: string): Promise<boolean> {
    const role = await this.prisma.roles.findUnique({
      where: { role_code },
    });
    return !!role;
  }

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    console.log("Creating role:", createRoleDto);

    const roleExists = await this.validateRole(createRoleDto.role_code);
    if (roleExists) {
      throw new ConflictException(`Role with code ${createRoleDto.role_code} already exists.`);
    }

    return this.prisma.roles.create({
      data: createRoleDto,
    });
  }

  async findAllRoles(): Promise<Role[]> {
    console.log("Fetching all roles");
    return this.prisma.roles.findMany();
  }

  async findRoleById(role_id: number): Promise<Role | null> {
    console.log(`Fetching role with ID: ${role_id}`);
    return this.prisma.roles.findUnique({
      where: { role_id },
    });
  }

  async updateRole(role_id: number, updateRoleDto: CreateRoleDto): Promise<Role> {
    console.log(`Updating role ${role_id} with data:`, updateRoleDto);

    const roleExists = await this.findRoleById(role_id);
    if (!roleExists) {
      throw new NotFoundException(`Role with ID ${role_id} not found.`);
    }

    return this.prisma.roles.update({
      where: { role_id },
      data: updateRoleDto,
    });
  }

  async deleteRole(role_id: number): Promise<Role> {
    console.log(`Deleting role with ID: ${role_id} and its related users`);
  
    // see if role exists
    const roleExists = await this.findRoleById(role_id);
    if (!roleExists) {
      throw new NotFoundException(`Role with ID ${role_id} not found.`);
    }
  
    // delete  user_role records 
    await this.prisma.user_role.deleteMany({
      where: { role_id },
    });
  
    // then the role 
    return this.prisma.roles.delete({
      where: { role_id },
    });
  }
  
}
