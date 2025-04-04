import {Injectable, OnModuleInit} from '@nestjs/common';
import {schedule} from 'node-cron';
import {PrismaClient} from '@prisma/client';

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
                    data: {period_date: new Date()},
                });

                const [allPorts, allGears] = await Promise.all([
                    this.prisma.ports.findMany(),
                    this.prisma.gear.findMany({
                        select: {
                            gear_code: true
                        }
                    })
                ]);

                const codes = allGears.map(gear => gear.gear_code);

                const data = allPorts.flatMap(port =>
                    codes.map(code => ({
                        port_id: port.port_id,
                        period_date: newPeriod.period_date,
                        active_days: 0,
                        gear_code: code
                    }))
                );

                await this.prisma.active_days.createMany({ data });


                console.log('New period created:', newPeriod);
            } catch (error) {
                console.error('Error creating new period:', error);
            }
        });
    }

}