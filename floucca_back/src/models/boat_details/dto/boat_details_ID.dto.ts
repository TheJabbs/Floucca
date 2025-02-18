import { IsNotEmpty, IsPositive } from 'class-validator';

export class BoatDetails_FleetOwner_Dto {
  @IsNotEmpty()
  fleet_owner: string;
}
