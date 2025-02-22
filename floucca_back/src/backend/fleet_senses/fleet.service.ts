import {Injectable, NotFoundException} from "@nestjs/common";
import {GetAllFleetInterface} from "./Interface/GetAllFleetInterface";
import {CreateFleetDto} from "./DTO";
import {PrismaService} from "../../prisma/prisma.service";
import {ResponseMessage} from "../../shared/interface/response.interface";
import {SenseFormContentInterface} from "./Interface/senseFormContent.interface";

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
        const newestPeriod = await this.prisma.period.findFirst({
            orderBy: {
                period_date: 'desc'
            }
        });

        if (!newestPeriod) {
            await this.prisma.period.create({
                data: {
                    period_date: new Date()
                }
            })
        }

        content.form.period_date = newestPeriod.period_date;
        const boatDetails = await this.prisma.boat_details.create({
            data: content.boatDetails
        });


        if (boatDetails) {
            content.form.boat_detail = boatDetails.boat_id
            const form = await this.prisma.form.create({
                data: content.form
            });

            if (form) {
                const sense = await this.prisma.fleet_senses.create({
                    data: {
                        form_id: form.form_id
                    }
                });

                if (sense) {
                    for (const gear of content.gearUsage) {
                        await this.prisma.gear_usage.create({
                            data: {
                                fleet_senses_id: sense.fleet_senses_id,
                                gear_code: gear.gear_code,
                                months: gear.months
                            }
                        });
                    }
                }
            } else {
                await this.prisma.boat_details.delete({
                    where: {
                        boat_id: boatDetails.boat_id
                    }
                });
            }
        } else {
            await this.prisma.boat_details.delete({
                where: {
                    boat_id: boatDetails.boat_id
                }
            });
        }

        return {
            message: 'Fleet senses form created'
        }
    }


}