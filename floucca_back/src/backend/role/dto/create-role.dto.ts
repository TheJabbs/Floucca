import { IsString, Length } from "class-validator";

export class CreateRoleDto {
  @IsString()
  @Length(2, 4, { message: "Role code must be between 2 and 4 characters" })
  role_code: string;

  @IsString()
  @Length(3, 20, { message: "Role name must be between 3 and 20 characters" })
  role_name: string;
}
