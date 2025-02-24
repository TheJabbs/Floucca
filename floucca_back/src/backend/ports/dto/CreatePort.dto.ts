import { IsString, IsInt, Min, MaxLength } from "class-validator";

export class CreatePortDto {
    @IsString()
    @MaxLength(50, { message: "Port name must not exceed 50 characters." })
    port_name: string;

    @IsInt({ message: "Coop code must be an integer." })
    @Min(1, { message: "Coop code must be a positive integer." })
    coop_code: number;
}