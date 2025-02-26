import { Controller, Get, Post, Param, Delete, Body, Put } from "@nestjs/common";
import { UserCoopService } from "./user_coop.service";
import { CreateUserCoopDto } from "./dto/create-user_coop.dto";
import { idDTO } from "../../shared/dto/id.dto";
import { UserCoop } from "./interfaces/user_coop.interface";

@Controller("user-coops")
export class UserCoopController {
  constructor(private readonly userCoopService: UserCoopService) {}

  @Post("create")
  async createUserCoop(@Body() createUserCoopDto: CreateUserCoopDto): Promise<UserCoop> {
    return this.userCoopService.createUserCoop(createUserCoopDto);
  }

  @Get("all")
  async findAllUserCoops(): Promise<UserCoop[]> {
    return this.userCoopService.findAllUserCoops();
  }

  @Get(":user_coop_id")
  async findUserCoopById(@Param("user_coop_id") user_coop_id: string): Promise<UserCoop | null> {
    const id = parseInt(user_coop_id, 10);
    return this.userCoopService.findUserCoopById(id);
  }
  

  @Put("update/:id")
  async updateUserCoop(@Param() params: idDTO, @Body() updateUserCoopDto: CreateUserCoopDto): Promise<UserCoop> {
    return this.userCoopService.updateUserCoop(params.id, updateUserCoopDto);
  }

  @Delete("delete/:user_coop_id")
  async deleteUserCoop(@Param("user_coop_id") user_coop_id: string): Promise<UserCoop> {
    const id = parseInt(user_coop_id, 10); 
    console.log("Deleting user coop with ID:", id);
    return this.userCoopService.deleteUserCoop(id);
  }
}
