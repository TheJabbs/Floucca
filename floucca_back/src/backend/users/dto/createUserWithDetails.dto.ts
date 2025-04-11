import { CreateUserDto } from "./create-users.dto";
export class CreateUserWithDetailsDto extends CreateUserDto {
    user: CreateUserDto;
    coop_codes: number[];   
    role_ids: number[];    
  }
  