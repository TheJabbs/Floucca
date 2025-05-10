import { Controller, Get, Post, Param, Delete, Body, Put, Req } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserWithDetailsDto } from "./dto/createUserWithDetails.dto";
import { UpdateUserWithDetailsDto } from "./dto/updateUserWithDetails.dto";
import { User } from "./interfaces/users.interface";
import { ResponseMessage } from "src/shared/interface/response.interface";
//auth and role restriction enumerator 
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleEnum } from 'src/auth/enums/role.enum';
import {GeneralFilterDto} from "../../shared/dto/general_filter.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  //might exclude admin if not his role 
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)  
@Post('admin-create')
async adminCreatesUser(
  @Body() body: CreateUserWithDetailsDto
): Promise<ResponseMessage<{ user_id: number }>> {
  try {
    return await this.userService.createUserWithDetails(body);
  } catch (error) {
    console.error('errir in adminCreatesUser:', error);
    throw error;
  }
}


  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)  
  @Get("all")
  async findAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)    
  @Get(":user_id")
  async findUserById(@Param("user_id") user_id: string, @Req() req): Promise<User | null> {
    const id = parseInt(user_id, 10);
    //console.log(`Authenticated user: ${req.user.user_id}`);
    return this.userService.findUserById(id);
  }

 // @UseGuards(JwtAuthGuard)
  @Put("update/:user_id")
  async updateUser(
    @Param("user_id") user_id: string,
    @Body() updateDto: UpdateUserWithDetailsDto
  ): Promise<ResponseMessage<{ user_id: number }>> {
    const id = parseInt(user_id, 10);
    return this.userService.updateUserWithDetails(id, updateDto);
  }
  

  //@UseGuards(JwtAuthGuard)
  @Put("update-last-login/:user_id")
  async updateLastLogin(@Param("user_id") user_id: string): Promise<void> {
    const id = parseInt(user_id, 10);
    console.log("Updating last login for user ID:", id);
    await this.userService.updateLastLogin(id);
  }

  //@UseGuards(JwtAuthGuard)
  @Delete("delete/:user_id")
  async deleteUser(@Param("user_id") user_id: string): Promise<User> {
    const id = parseInt(user_id, 10);
    console.log("Deleting user with ID:", id);
    return this.userService.deleteUser(id);
  }

  @Post('/workload')
  async getWorkload(@Body() filter : GeneralFilterDto): Promise<any> {
    return this.userService.getWorkLoadStat(filter);
  }
}
