import {Injectable, NotFoundException} from "@nestjs/common";
import {GetAllGearInterface} from "./interface/get_all_gear.interface";
import {CreateGearDto} from "./dto/create_gear.dto";
import Any = jasmine.Any;
import {PrismaService} from "../../prisma/prisma.service";
import {ResponseMessage} from "../../shared/interface/response.interface";
import {UpdateGearDto} from './dto/update_gear.dto';
import {samplingLanding} from "./mapper/samplingGearDaysLanding.mapper";
import {samplingEffort} from "./mapper/samplingGearDaysEffort";

@Injectable()
export class GearService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getAllGear(): Promise<GetAllGearInterface[]> {
        const gear = await this.prisma.gear.findMany();

        if (!gear || gear.length === 0) {
            throw new NotFoundException('No gear found');
        }

        return gear;
    }

    async getGearById(id: number): Promise<GetAllGearInterface> {
        const gear = await this.prisma.gear.findUnique({
            where: {gear_code: id},
            select: {
                gear_code: true,
                gear_name: true,
                equipment_id: true,
                equipment_name: true,
            }
        });

        if (!gear) {
            throw new NotFoundException('No gear found');
        }

        return gear;
    }

    async createGear(gear: CreateGearDto): Promise<ResponseMessage<any>> {
        try {
            const checkGear = await this.getGearById(gear.gear_code);
            return {
                message: 'Gear already exists',
                data: checkGear
            };
        } catch {
            const newGear = await this.prisma.gear.create({data: gear});
            return {
                message: 'Gear created successfully',
                data: newGear
            };
        }
    }


    async updateGear(id: number, gear: UpdateGearDto): Promise<ResponseMessage<any>> {
        const checkGear = await this.getGearById(id);

        if (!checkGear) {
            return {message: 'Gear not found'};
        }

        const updatedGear = await this.prisma.gear.update({
            where: {gear_code: id},
            data: {
                gear_name: gear.gear_name ?? checkGear.gear_name,
                equipment_id: gear.equipment_id ?? checkGear.equipment_id,
                equipment_name: gear.equipment_name ?? checkGear.equipment_name,
            },
        });

        return {
            message: 'Gear updated successfully',
            data: updatedGear,
        };
    }


    async deleteGear(id: number): Promise<ResponseMessage<Any>> {
        const checkGear = await this.getGearById(id);
        if (!checkGear) {
            return {
                message: 'Gear not found'
            }
        }

        await this.prisma.gear.delete({
            where: {gear_code: id}
        });

        return {
            message: 'Gear deleted successfully',
        }
    }

    async getSamplingGearsDaysLanding(gearCode: number, periodDate: string) {
        const date = new Date(periodDate);

        const forms = await this.prisma.fish.findMany({
            select: {
                landing: {
                    select: {
                        form: {
                            select: {
                                creation_time: true
                            }
                        }
                    }
                },
                gear_code: true,
            },
            where: {
                gear_code: gearCode,
                landing: {
                    form: {
                        period_date: {
                            gte: new Date(date.getFullYear(), date.getMonth(), 1),
                            lte: new Date(date.getFullYear(), date.getMonth() + 1, 0)
                        }
                    }
                }
            }
        })
        return samplingLanding(forms);
    }

    async getSamplingGearsDaysEffort(gearCode: number, periodDate: string) {
        const date = new Date(periodDate);

        const forms = await this.prisma.sense_lastw.findMany({
            select: {
                form: {
                    select: {
                        creation_time: true
                    }

                },
                gear_code: true,
            },
            where: {
                gear_code: gearCode,
                form: {
                    period_date: {
                        gte: new Date(date.getFullYear(), date.getMonth(), 1),
                        lte: new Date(date.getFullYear(), date.getMonth() + 1, 0)
                    }
                }

            }
        })

        return samplingEffort(forms);
    }

}