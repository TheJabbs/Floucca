import { IsInt, IsPositive, IsString, IsDate, Min, IsOptional } from "class-validator";

export class UpdateSenseLastwDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  days_fished?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  gear_code?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  form_id?: number;
}
