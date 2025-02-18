import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsNumber, IsOptional,
} from 'class-validator';

export class CreateBoatDetailsDto {


  @IsString()
  @IsNotEmpty()
  fleet_owner?: string = 'Unknown';

  @IsNotEmpty()
  @IsInt()
  fleet_size?: number;

  @IsNotEmpty()
  @IsInt()
  fleet_crew?: number;

  @IsNotEmpty()
  @IsNumber()
  fleet_max_weight?: number;

  @IsNotEmpty()
  @IsNumber()
  fleet_length?: number;

  @IsNotEmpty()
  @IsInt()
  fleet_registration?: number;


}
