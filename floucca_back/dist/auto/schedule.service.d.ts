import { OnModuleInit } from '@nestjs/common';
export declare class ScheduleService implements OnModuleInit {
    private readonly prisma;
    onModuleInit(): void;
    private scheduleGeneratePeriod;
}
