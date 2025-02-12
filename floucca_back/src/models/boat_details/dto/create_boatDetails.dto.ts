import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsPositive,
  IsNumber,
} from 'class-validator';

export class CreateBoatDetailsDto {
  @IsInt()
  @IsPositive()
  boat_id: number;

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

  @IsNotEmpty()
  @IsInt({ each: true })
  fleet_senses_id?: number[];

  @IsNotEmpty()
  @IsInt({ each: true })
  landing_id?: number[];
}
