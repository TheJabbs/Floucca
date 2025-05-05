import {
  IsString,
  IsInt,
  IsNumber, IsOptional,
} from 'class-validator';

export class CreateBoatDetailsDto {

  @IsOptional()
  @IsString()
  fleet_owner?: string = 'Unknown';

  @IsOptional()
  @IsInt()
  fleet_hp?: number;

  @IsOptional()
  @IsInt()
  fleet_crew?: number;

  @IsOptional()
  @IsNumber()
  fleet_max_weight?: number;

  @IsOptional()
  @IsNumber()
  fleet_length?: number;

  @IsOptional()
  @IsInt()
  fleet_registration?: number;


}
