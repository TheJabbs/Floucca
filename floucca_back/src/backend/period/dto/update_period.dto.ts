import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class UpdatePeriodDto {
    @IsNotEmpty()
    @IsDateString()
    period_date: string;

    @IsNotEmpty()
    @IsString()
    period_status: string;
}