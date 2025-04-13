import { IsString, IsEmail, IsOptional, Length, Matches } from "class-validator";

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 20)
  user_fname?: string;

  @IsOptional()
  @IsString()
  @Length(2, 20)
  user_lname?: string;

  @IsOptional()
  @IsEmail()
  user_email?: string;

  @IsOptional()
  @Matches(/^\d{8,15}$/, { message: "Phone number must be between 8-15 digits." })
  user_phone?: string;

  @IsOptional()
  @IsString()
  @Length(8, 100)
  user_pass?: string;
}
