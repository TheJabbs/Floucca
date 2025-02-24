import { IsInt, Min, IsString, IsOptional, MaxLength, IsPositive } from "class-validator";

export class CreateSpecieDto {
  @IsInt()
  @Min(1, { message: "specie_code must be a positive integer." })
  specie_code: number;

  @IsString()
  @MaxLength(50, { message: "specie_name must not exceed 50 characters." })
  specie_name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: "specie_description must not exceed 500 characters." })
  specie_description?: string;

  @IsPositive({ message: "specie_avg_weight must be a positive number." })
  specie_avg_weight: number;

  @IsPositive({ message: "specie_avg_length must be a positive number." })
  specie_avg_length: number;
}
