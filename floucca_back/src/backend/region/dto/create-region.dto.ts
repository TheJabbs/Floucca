import { IsInt, Min, IsString, Length } from "class-validator";

export class CreateRegionDto {
  @IsInt({ message: "Region code must be an integer." })
  @Min(1, { message: "Region code must be a positive integer." })
  region_code: number;

  @IsString()
  @Length(2, 50, { message: "Region name must be between 2 and 50 characters." })
  region_name: string;
}
