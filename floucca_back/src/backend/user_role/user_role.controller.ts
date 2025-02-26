import { Controller, Get, Post, Param, Delete, Body, Put } from "@nestjs/common";
import { UserRoleService } from "./user_role.service";
import { CreateUserRoleDto } from "./dto/create-user_role.dto";
import { idDTO } from "../../shared/dto/id.dto";
import { UserRole } from "./interfaces/user_role.interface";

@Controller("user-roles")
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @Post("create")
  async createUserRole(@Body() createUserRoleDto: CreateUserRoleDto): Promise<UserRole> {
    return this.userRoleService.createUserRole(createUserRoleDto);
  }

  @Get("all")
  async findAllUserRoles(): Promise<UserRole[]> {
    return this.userRoleService.findAllUserRoles();
  }

  @Get(":id")
  async findUserRoleById(@Param() params: idDTO): Promise<UserRole | null> {
    return this.userRoleService.findUserRoleById(params.id);
  }

  @Put("update/:id")
  async updateUserRole(@Param() params: idDTO, @Body() updateUserRoleDto: CreateUserRoleDto): Promise<UserRole> {
    return this.userRoleService.updateUserRole(params.id, updateUserRoleDto);
  }

  @Delete("delete/:user_role_id")
  async deleteUserRole(@Param("user_role_id") user_role_id: string): Promise<UserRole> {
    const id = parseInt(user_role_id, 10); 
    console.log("Deleting user role with ID:", id);
    return this.userRoleService.deleteUserRole(id);
  }
  
}
