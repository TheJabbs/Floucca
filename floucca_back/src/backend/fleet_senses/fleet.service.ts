import {Injectable, NotFoundException} from "@nestjs/common";
import {GetAllFleetInterface} from "./interface/get_all_fleet.interface";
import {CreateFleetDto} from "./dto";
import {PrismaService} from "../../prisma/prisma.service";
import {ResponseMessage} from "../../shared/interface/response.interface";
import {SenseFormContentInterface} from "./interface/sense_form_content.interface";
import {GeneralFilterDto} from "../../shared/dto/general_filter.dto";
import {FleetReportInterface} from "./interface/fleetReport.interface";


@Injectable()
export class FleetService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getAllFleet(): Promise<GetAllFleetInterface[]> {
        const fleet = await this.prisma.fleet_senses.findMany({
                select: {
                    fleet_senses_id: true,
                    form_id: true,
                    gear_usage: {
                        select: {
                            gear_code: true,
                            months: true
                        }
                    }
                }
            }
        );

        if (!fleet || fleet.length === 0) {
            throw new NotFoundException('No fleet senses found');
        }

        return fleet;
    }

    async getFleetById(id: number): Promise<GetAllFleetInterface> {
        const fleet = await this.prisma.fleet_senses.findUnique({
            where: {fleet_senses_id: id},
            select: {
                fleet_senses_id: true,
                form_id: true,
                gear_usage: {
                    select: {
                        gear_code: true,
                        months: true,
                    }
                }
            }
        });

        if (!fleet) {
            throw new NotFoundException('No fleet senses found');
        }

        return fleet;
    }

    async createFleet(fleet: CreateFleetDto): Promise<ResponseMessage<any>> {
        if (!await this.validate(fleet.form_id)) {
            return {
                message: "Form or boat details not found"
            }
        }

        const newFleet = await this.prisma.fleet_senses.create({
            data: {
                form_id: fleet.form_id
            }
        });

        return {
            message: "Fleet created",
        }

    }

    async updateFleet(id: number, fleet: CreateFleetDto): Promise<ResponseMessage<any>> {
        if (!await this.validate(fleet.form_id)) {
            return {
                message: "Form or boat details not found"
            }
        }

        const updatedFleet = await this.prisma.fleet_senses.update({
            where: {fleet_senses_id: id},
            data: {
                form_id: fleet.form_id
            }
        });
    }

    async deleteFleet(id: number): Promise<ResponseMessage<any>> {
        const check = await this.prisma.fleet_senses.findUnique({
            where: {fleet_senses_id: id}
        });

        if (!check) {
            return {
                message: "Fleet not found"
            }
        }
        return {
            message: "Fleet deleted",
        }
    }


    async getAllFleetByDate(start: Date, end: Date): Promise<GetAllFleetInterface[]> {
        const fleet = await this.prisma.fleet_senses.findMany({
            where: {
                form: {
                    creation_time: {
                        gte: start,
                        lte: end
                    }
                }
            },
            include: {
                form: true,
                gear_usage: {
                    select: {
                        gear_code: true,
                        months: true
                    }
                }
            }
        });

        if (!fleet || fleet.length === 0) {
            throw new NotFoundException('No fleet senses found');
        }

        return fleet;
    }


//Validate
    async validate(form_id: number): Promise<boolean> {
        const form = await this.prisma.form.findFirst({
            where: {
                form_id: form_id
            }
        })

        return !(!form);

    }

    async createFleetSensesForm(content: SenseFormContentInterface): Promise<ResponseMessage<any>> {
        const boatDetails = await this.prisma.boat_details.create({data: content.boatDetails});
        content.form.boat_detail = boatDetails.boat_id;

        return await this.prisma.$transaction(async (prisma) => {
            let newestPeriod = await prisma.period.findFirst({
                orderBy: {period_date: 'desc'}
            });

            if (!newestPeriod) {
                newestPeriod = await prisma.period.create({
                    data: {period_date: new Date()}
                });
            }

            content.form.period_date = newestPeriod.period_date;

            const form = await prisma.form.create({data: content.form});
            if (!form) throw new Error("Failed to create form");

            const sense = await prisma.fleet_senses.create({data: {form_id: form.form_id}});

            if (sense && content.gearUsage.length > 0) {
                await Promise.all(
                    content.gearUsage.map(gear =>
                        prisma.gear_usage.create({
                            data: {
                                fleet_senses_id: sense.fleet_senses_id,
                                gear_code: gear.gear_code,
                                months: gear.months
                            }
                        })
                    )
                );
            }

            return {message: 'Fleet senses form created successfully'};
        }).catch(async (error) => {
            await this.prisma.boat_details.delete({where: {boat_id: boatDetails.boat_id}});
            console.error("Transaction failed:", error);
            return {message: `Failed to create fleet senses form: ${error.message}`};
        });
    }

    async generateFleetReport(filter: GeneralFilterDto, month?: number) {
        const time = new Date(filter.period);
        const start = new Date(time.getFullYear(), 0, 1);
        const end = new Date(time.getFullYear(), 11, 31);

        const [fleet, activeDays] = await Promise.all([
            this.prisma.fleet_senses.findMany({
                where: {
                    form: {
                        creation_time: {
                            gte: start,
                            lte: end
                        },
                        port_id: filter.port_id ? { in: filter.port_id } : undefined,
                    },
                    gear_usage: {
                        some: {
                            months: month ? month : undefined,
                            gear_code: filter.gear_code ? { in: filter.gear_code } : undefined,
                        }
                    },
                },
                select: {
                    gear_usage: {
                        select: {
                            gear_code: true,
                            months: true
                        }
                    }
                }
            }),
            this.prisma.active_days.findMany({
                where: {
                    port_id: filter.port_id ? { in: filter.port_id } : undefined,
                    gear_code: filter.gear_code ? { in: filter.gear_code } : undefined,
                    period_date: {
                        gt: start,
                        lt: end
                    }
                }
            }),
        ]);

        if (!fleet || fleet.length === 0) {
            throw new NotFoundException('No fleet senses found');
        }

        // 1. Frequency of gear use per month
        const freqMap = new Map<string, number>(); // key: gear_code_month

        for (const sense of fleet) {
            for (const usage of sense.gear_usage) {
                const key = `${usage.gear_code}_${usage.months}`;
                freqMap.set(key, (freqMap.get(key) || 0) + 1);
            }
        }

        // 2. Calculate average active_days per (gear_code, month) across ports
        const activeDayMap = new Map<string, number[]>(); // key: gear_code_month => array of values

        for (const day of activeDays) {
            if (day.gear_code === null) continue;
            const month = day.period_date.getMonth() + 1;
            const key = `${day.gear_code}_${month}`;
            if (!activeDayMap.has(key)) {
                activeDayMap.set(key, []);
            }
            activeDayMap.get(key)?.push(day.active_days);
        }

        const activeAverages = new Map<string, number>();
        for (const [key, daysArr] of activeDayMap.entries()) {
            const avg = daysArr.reduce((sum, val) => sum + val, 0) / daysArr.length;
            activeAverages.set(key, Math.round(avg)); // rounding is optional
        }

        // 3. Merge into final report
        const fleetReport = new Map<number, FleetReportInterface[]>();

        for (const [key, freq] of freqMap.entries()) {
            const [gear_code, monthStr] = key.split('_');
            const m = parseInt(monthStr, 10);
            const active = activeAverages.get(key) || 0;

            const entry: FleetReportInterface = {
                month: m,
                freq,
                activeDays: active
            };

            if (!fleetReport.has(m)) {
                fleetReport.set(m, []);
            }

            fleetReport.get(m)?.push(entry);
        }

        const record: Record<number, FleetReportInterface[]> = {};

        fleetReport.forEach((value, key) => {
            record[key] = value;
        });

        return record;
    }

}