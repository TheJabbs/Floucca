import {Injectable, OnModuleInit} from '@nestjs/common';
import {schedule} from 'node-cron';
import {PrismaClient} from '@prisma/client';
import {PrismaService} from "../prisma/prisma.service";
import {BackupService} from "../backend/backup/backup.service";

@Injectable()
export class ScheduleService implements OnModuleInit {
    constructor(private readonly prisma: PrismaService, private readonly backupService: BackupService) {
    }

    onModuleInit() {
        this.scheduleGeneratePeriod();
        this.scheduleBackup();
    }

    private scheduleGeneratePeriod() {
        schedule('0 0 1 * *', async () => {
            try {
                const currentDate = new Date();

                const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

                const newPeriod = await this.prisma.period.create({
                    data: {period_date: nextMonthDate},
                });

                const [allPorts, allGears] = await Promise.all([
                    this.prisma.ports.findMany(),
                    this.prisma.gear.findMany({
                        select: {
                            gear_code: true,
                        },
                    }),
                ]);

                const codes = allGears.map((gear) => gear.gear_code);

                const data = allPorts.flatMap((port) =>
                    codes.map((code) => ({
                        port_id: port.port_id,
                        period_date: newPeriod.period_date,
                        active_days: 0,
                        gear_code: code,
                    }))
                );

                await this.prisma.active_days.createMany({data});

                console.log('New period created:', newPeriod);
            } catch (error) {
                console.error('Error creating new period:', error);
            }
        });
    }

    private scheduleBackup() {
        schedule('0 0 * * 0', async () => {
            try {
                const backup = await this.backupService.dumpAndSaveBackup();
                console.log('Backup created:', backup);
            } catch (error) {
                console.error('Error creating backup:', error);
            }
        });
    }

}
