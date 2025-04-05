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

    /**
     * Generate a fleet report based on the given filter and month.
     *
     * The report will contain the frequency of gear use per month and the average
     * number of active days per month for each gear type.
     *
     * @param filter - The filter to apply to the report.
     * @param month - The month to report on. If not provided, the report will
     * be generated for all months.
     * @returns A list of FleetReportInterface objects, each containing the gear
     * code, gear name, month, frequency of gear use, and average number of active
     * days for that gear type and month.
     * @throws {NotFoundException} If no fleet senses are found.
     */
    async generateFleetReport(filter: GeneralFilterDto, month?: number) {
        const time = new Date(filter.period);
        const start = new Date(time.getFullYear(), 0, 1);
        const end = new Date(time.getFullYear(), 11, 31);

        const [fleet, activeDays, gearNames] = await Promise.all([
            this.prisma.fleet_senses.findMany({
                where: {
                    form: {
                        period_date: {
                            gte: start,
                            lte: end
                        },
                        port_id: filter.port_id ? {in: filter.port_id} : undefined,
                    },
                    gear_usage: {
                        some: {
                            months: month ? month : undefined,
                            gear_code: filter.gear_code ? {in: filter.gear_code} : undefined,
                        }
                    },
                },
                select: {
                    gear_usage: {
                        where: month !== undefined ? { months: month } : undefined,
                        select: {
                            gear_code: true,
                            months: true
                        }
                    }
                }
            }),
            this.prisma.active_days.findMany({
                where: {
                    port_id: filter.port_id ? {in: filter.port_id} : undefined,
                    gear_code: filter.gear_code ? {in: filter.gear_code} : undefined,
                    period_date: {
                        gt: start,
                        lt: end
                    }
                }
            }),
            this.prisma.gear.findMany({
                select: {
                    gear_code: true,
                    gear_name: true,
                }
            })
        ]);

        if (!fleet || fleet.length === 0) {
            throw new NotFoundException('No fleet senses found');
        }

        // Create a map for gear codes to gear names
        const gearMap = new Map<number, string>();
        gearNames.forEach(gear => {
            gearMap.set(gear.gear_code, gear.gear_name);
        });

        // Frequency of gear use per month
        const freqMap = new Map<string, number>();
        fleet.forEach(sense => {
            sense.gear_usage.forEach(usage => {
                const key = `${usage.gear_code}_${usage.months}`;
                freqMap.set(key, (freqMap.get(key) || 0) + 1);
            });
        });

        const activeDayMap = new Map<string, number[]>();
        activeDays.forEach(day => {
            if (day.gear_code === null) return;
            const month = day.period_date.getMonth() + 1;
            const key = `${day.gear_code}_${month}`;
            if (!activeDayMap.has(key)) {
                activeDayMap.set(key, []);
            }
            activeDayMap.get(key)?.push(day.active_days);
        });

        const activeAverages = new Map<string, number>();
        activeDayMap.forEach((daysArr, key) => {
            const avg = daysArr.reduce((sum, val) => sum + val, 0) / daysArr.length;
            activeAverages.set(key, Math.round(avg));
        });

        // Merge data into final report
        const fleetReport: FleetReportInterface[] = [];
        freqMap.forEach((freq, key) => {
            const [gear_code, monthStr] = key.split('_');
            const month = parseInt(monthStr, 10);
            const active = activeAverages.get(key) || 0;

            // Fetch the gear name from the gearMap
            const gearName = gearMap.get(parseInt(gear_code)) || 'Unknown Gear';

            fleetReport.push({
                gear_code: parseInt(gear_code),
                gear_name: gearName, // zdet gear name to the report
                month,
                freq,
                activeDays: active
            });
        });

        return fleetReport;
    }
}