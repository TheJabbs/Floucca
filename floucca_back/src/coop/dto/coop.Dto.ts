import { IsNotEmpty} from "class-validator";


export class CoopDto {
    @IsNotEmpty()
    coop_code: number;
    @IsNotEmpty()
    region_code: number;
    @IsNotEmpty()
    coop_name: string;
}