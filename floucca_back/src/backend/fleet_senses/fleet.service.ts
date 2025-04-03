import {Injectable, NotFoundException} from "@nestjs/common";
import {GetAllFleetInterface} from "./interface/get_all_fleet.interface";
import {CreateFleetDto} from "./dto";
import {PrismaService} from "../../prisma/prisma.service";
import {ResponseMessage} from "../../shared/interface/response.interface";
import {SenseFormContentInterface} from "./interface/sense_form_content.interface";
import {GeneralFilterDto} from "../../shared/dto/general_filter.dto";

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
        const boatDetails = await this.prisma.boat_details.create({ data: content.boatDetails });
        content.form.boat_detail = boatDetails.boat_id;

        return await this.prisma.$transaction(async (prisma) => {
            let newestPeriod = await prisma.period.findFirst({
                orderBy: { period_date: 'desc' }
            });

            if (!newestPeriod) {
                newestPeriod = await prisma.period.create({
                    data: { period_date: new Date() }
                });
            }

            content.form.period_date = newestPeriod.period_date;

            const form = await prisma.form.create({ data: content.form });
            if (!form) throw new Error("Failed to create form");

            const sense = await prisma.fleet_senses.create({ data: { form_id: form.form_id } });

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

            return { message: 'Fleet senses form created successfully' };
        }).catch(async (error) => {
            await this.prisma.boat_details.delete({ where: { boat_id: boatDetails.boat_id} });
            console.error("Transaction failed:", error);
            return { message: `Failed to create fleet senses form: ${error.message}` };
        });
    }

    async generateFleetReport(filter: GeneralFilterDto){
        const time = new Date (filter.period);
        const start = new Date(time.getFullYear(), 0, 1);
        const end = new Date(time.getFullYear(), 11, 31);

        const fleet = await this.prisma.fleet_senses.findMany({
            where: {
                form: {
                    creation_time: {
                        gte: start,
                        lte: end
                    },
                    port_id: filter.port_id ? {in: filter.port_id} : undefined
                }
            },
            include: {
                form:{
                    select:{
                        period_date: true
                    }
                },
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

        const record: Record<string, number[]> = {}

        fleet.forEach((item) => {
            item.gear_usage.forEach((gear) => {
                if (!record[gear.gear_code]) {
                    record[gear.gear_code] = [];
                }
                record[gear.gear_code].push(gear.months);
            });
        });

        const result = Object.entries(record).map(([gear_code, months]) => {
            return {
                gear_code,
                months: months.reduce((acc, month) => {
                    acc[month] = (acc[month] || 0) + 1;
                    return acc;
                }, {})
            };
        });

        return {
            message: "Fleet report generated",
            data: result
        }
    }

}