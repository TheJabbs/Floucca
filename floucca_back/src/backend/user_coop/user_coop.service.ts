import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateUserCoopDto } from "./dto/create-user_coop.dto";
import { UserCoop } from "./interfaces/user_coop.interface";

@Injectable()
export class UserCoopService {
  constructor(private prisma: PrismaService) {}

  async validateUserCoop(user_id: number, coop_code: number): Promise<boolean> {
    const userExists = await this.prisma.users.findUnique({
      where: { user_id },
    });

    const coopExists = await this.prisma.coop.findUnique({
      where: { coop_code },
    });

    return !!(userExists && coopExists);
  }

  async createUserCoop(createUserCoopDto: CreateUserCoopDto): Promise<UserCoop> {
    console.log("Received data for creation:", createUserCoopDto);

    const isValid = await this.validateUserCoop(
      createUserCoopDto.user_id,
      createUserCoopDto.coop_code
    );

    if (!isValid) {
      throw new NotFoundException("Either user_id or coop_code does not exist.");
    }

    return this.prisma.user_coop.create({
      data: createUserCoopDto,
    });
  }

  async findAllUserCoops(): Promise<UserCoop[]> {
    return this.prisma.user_coop.findMany();
  }

  async findUserCoopById(user_coop_id: number): Promise<UserCoop | null> {
    return this.prisma.user_coop.findUnique({
      where: { user_coop_id },
    });
  }

  async updateUserCoop(user_coop_id: number, updateUserCoopDto: CreateUserCoopDto): Promise<UserCoop> {
    console.log("Received data for update:", updateUserCoopDto);

    const userCoopExists = await this.findUserCoopById(user_coop_id);
    if (!userCoopExists) {
      throw new NotFoundException(`UserCoop with ID ${user_coop_id} not found.`);
    }

    const isValid = await this.validateUserCoop(
      updateUserCoopDto.user_id,
      updateUserCoopDto.coop_code
    );

    if (!isValid) {
      throw new NotFoundException("Either user_id or coop_code does not exist.");
    }

    return this.prisma.user_coop.update({
      where: { user_coop_id },
      data: updateUserCoopDto,
    });
  }

  async deleteUserCoop(user_coop_id: number): Promise<UserCoop> {
    console.log("Deleting UserCoop with ID:", user_coop_id);

    const userCoopExists = await this.findUserCoopById(user_coop_id);
    if (!userCoopExists) {
      throw new NotFoundException(`UserCoop with ID ${user_coop_id} not found.`);
    }

    return this.prisma.user_coop.delete({
      where: { user_coop_id },
    });
  }
}
