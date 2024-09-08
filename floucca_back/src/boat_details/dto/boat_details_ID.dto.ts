import { IsNotEmpty, IsPositive } from 'class-validator';

export class BoatDetails_Id_Dto {
  @IsPositive()
  @IsNotEmpty()
  boat_details_id: number;
}

export class BoatDetails_FleetOwner_Dto {
  @IsNotEmpty()
  fleet_owner: string;
}
