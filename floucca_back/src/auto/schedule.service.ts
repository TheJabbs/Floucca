import { Injectable, OnModuleInit } from '@nestjs/common';
import {schedule} from 'node-cron';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ScheduleService implements OnModuleInit {
  private readonly prisma = new PrismaClient();

  onModuleInit() {
    this.scheduleGeneratePeriod();
  }

    private scheduleGeneratePeriod() {
        schedule('0 0 1 * *', async () => {
            try {
                const newPeriod = await this.prisma.period.create({
                    data: { period_date: new Date() },
                });
                console.log('New period created:', newPeriod);
            } catch (error) {
                console.error('Error creating new period:', error);
            }
        });
    }

}