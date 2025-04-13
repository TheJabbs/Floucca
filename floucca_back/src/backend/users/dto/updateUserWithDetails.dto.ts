import { IsArray, IsInt, IsOptional } from "class-validator";
import { CreateUserDto } from "./create-users.dto";

export class UpdateUserWithDetailsDto extends CreateUserDto {
  @IsOptional()
  @IsArray()
  coop_codes?: number[];

  @IsOptional()
  @IsArray()
  role_ids?: number[];
}
