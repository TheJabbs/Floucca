import { IsInt, Min } from "class-validator";

export class CreateUserRoleDto {
  @IsInt({ message: "User ID must be an integer." })
  @Min(1, { message: "User ID must be a positive integer." })
  user_id: number;

  @IsInt({ message: "Role ID must be an integer." })
  @Min(1, { message: "Role ID must be a positive integer." })
  role_id: number;
}
