import { IsInt, Min } from "class-validator";

export class CreateUserCoopDto {
  @IsInt({ message: "User ID must be an integer." })
  @Min(1, { message: "User ID must be a positive integer." })
  user_id: number;

  @IsInt({ message: "Coop Code must be an integer." })
  @Min(1, { message: "Coop Code must be a positive integer." })
  coop_code: number;
}
