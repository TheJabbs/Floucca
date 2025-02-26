import { Controller, Get, Post, Param, Delete, Body, Put } from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from "./dto/create-users.dto";
import { User } from "./interfaces/users.interface";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("create")
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Get("all")
  async findAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @Get(":user_id")
  async findUserById(@Param("user_id") user_id: string): Promise<User | null> {
    const id = parseInt(user_id, 10); 
    return this.userService.findUserById(id);
  }

  @Put("update/:user_id")
  async updateUser(@Param("user_id") user_id: string, @Body() updateUserDto: CreateUserDto): Promise<User> {
    const id = parseInt(user_id, 10); 
    return this.userService.updateUser(id, updateUserDto);
  }

  @Put("update-last-login/:user_id")
  async updateLastLogin(@Param("user_id") user_id: string): Promise<void> { 
    const id = parseInt(user_id, 10); 
    console.log("Updating last login for user ID:", id);
    await this.userService.updateLastLogin(id); 
  }
  

  @Delete("delete/:user_id")
  async deleteUser(@Param("user_id") user_id: string): Promise<User> {
    const id = parseInt(user_id, 10); 
    console.log("Deleting user with ID:", id);
    return this.userService.deleteUser(id);
  }
}
