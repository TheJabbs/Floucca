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

                const allPorts = await this.prisma.ports.findMany();

                const createActiveDaysPromises = allPorts.map(port =>
                    this.prisma.active_days.create({
                        data: {
                            port_id: port.port_id,
                            period_date: newPeriod.period_date,
                        },
                    })
                );

                await Promise.all(createActiveDaysPromises);

                console.log('New period created:', newPeriod);
            } catch (error) {
                console.error('Error creating new period:', error);
            }
        });
    }

}