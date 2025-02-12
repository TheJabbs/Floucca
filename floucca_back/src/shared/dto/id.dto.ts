import {IsNumber, IsPositive} from "class-validator";

export class idDTO{
    @IsPositive()
    @IsNumber()
    id: number;
}