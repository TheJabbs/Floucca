import {IsInt, Min} from "class-validator";
import {Transform} from "class-transformer";

export class idDTO{
    @Transform(({ value }) => parseInt(value, 10))  // Convert string to integer
    @IsInt({ message: 'The id must be an integer.' })
    @Min(1, { message: 'The id must be a positive integer.' })
    id: number;
}