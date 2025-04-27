import { IsInt, Min, IsOptional, IsString, Length } from "class-validator";

export class UpdateRegionDto {
  @IsOptional()
  @IsInt({ message: "Region code must be an integer." })
  @Min(1, { message: "Region code must be a positive integer." })
  region_code?: number;

  @IsOptional()
  @IsString()
  @Length(2, 50, { message: "Region name must be between 2 and 50 characters." })
  region_name?: string;
}
