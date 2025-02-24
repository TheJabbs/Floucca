import { Controller, Get, Post, Param, Delete, Body, Put } from "@nestjs/common";
import { RoleService } from "./role.service";
import { CreateRoleDto } from "./dto/create-role.dto";
import { idDTO } from "../../shared/dto/id.dto";
import { Role } from "./interfaces/role.interface";

@Controller("roles")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post("create")
  async createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(createRoleDto);
  }

  @Get("all")
  async findAllRoles(): Promise<Role[]> {
    return this.roleService.findAllRoles();
  }

  @Get(":role_id")
  async findRoleById(@Param() params: idDTO): Promise<Role | null> {
    return this.roleService.findRoleById(params.id);
  }

  @Put("update/:role_id")
  async updateRole(@Param() params: idDTO, @Body() updateRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.updateRole(params.id, updateRoleDto);
  }

  @Delete("delete/:role_id")
  async deleteRole(@Param() params: idDTO): Promise<Role> {
    console.log("Received request to delete role with ID:", params.id);
    return this.roleService.deleteRole(params.id);
  }
}
