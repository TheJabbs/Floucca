import { IsString, IsEmail, IsOptional, Length, Matches, IsArray, ArrayNotEmpty, IsInt, Min } from 'class-validator';

export class CreateUserWithDetailsDto {
  @IsString()
  @Length(2, 20)
  user_fname: string;

  @IsString()
  @Length(2, 20)
  user_lname: string;

  @IsOptional()
  @IsEmail()
  user_email?: string;

  @IsOptional()
  @Matches(/^\d{8,15}$/, { message: "Phone number must be between 8-15 digits." })
  user_phone?: string;

  @IsString()
  @Length(8, 100)
  user_pass: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  coop_codes: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  role_ids: number[];
}
