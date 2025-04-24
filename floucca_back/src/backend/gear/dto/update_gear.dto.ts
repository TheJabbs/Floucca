import { IsNumber, IsPositive, IsString, Length, IsOptional } from 'class-validator';

export class UpdateGearDto {
  @IsOptional()
  @IsString()
  gear_name?: string;

  @IsOptional()
  @IsString()
  @Length(3, 5)
  equipment_id?: string;

  @IsOptional()
  @IsString()
  equipment_name?: string;
}
