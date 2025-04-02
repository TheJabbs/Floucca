import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {CreateActiveDaysDto} from "./dto/createActiveDays.dto";

@Injectable()
export class ActiveDaysService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getAllActiveDays() {
        const ad = await this.prisma.active_days.findMany();
        if (ad.length === 0) {
            throw new Error('No active days found');
        }
        return ad;
    }

    async getActiveDaysById(id: number) {
        const ad = await this.prisma.active_days.findUnique({
            where: {
                active_id: id
            }
        });
        if (!ad) {
            throw new Error('No active days found');
        }
        return ad;
    }

    async createActiveDays(gd: CreateActiveDaysDto) {
        const isValid = await this.validate(gd, true);
        if (!isValid) {
            return {
                message: 'Invalid active days',
                data: null
            }
        }

        const newActiveDays = await this.prisma.active_days.create({
            data: gd
        });

        return {
            message: 'Active days created',
            data: newActiveDays
        }
    }

    async updateActiveDays(id: number, gd: CreateActiveDaysDto) {
        const isValid = await this.validate(gd, false);
        if (!isValid) {
            return {
                message: 'Invalid active days',
                data: null
            }
        }

        const updatedActiveDays = await this.prisma.active_days.update({
            where: {
                active_id: id
            },
            data: gd
        });

        return {
            message: 'Active days updated',
            data: updatedActiveDays
        }
    }

    async deleteActiveDays(id: number) {
        const ad = await this.getActiveDaysById(id);

        if (!ad) {
            return {
                message: 'Active days not found',
                data: null
            }
        }

        await this.prisma.active_days.delete({
            where: {
                active_id: id
            }
        });

        return {
            message: 'Active days deleted',
            data: ad
        }
    }

    //================================================================
    async validate(gd: any, isCreate: boolean) {
        if (gd.period_date) {
            const [checkAlreadyExists, checkIfExists] = await Promise.all([
                this.prisma.active_days.findMany({
                    where: {
                        period_date: gd.period_date
                    }
                }),
                this.prisma.period.findUnique({
                    where: {
                        period_date: gd.period_date
                    }
                })
            ])

            if (!(((checkAlreadyExists.length === 0 && isCreate) || (checkAlreadyExists.length !== 0 && !isCreate)) && checkIfExists))
                return false;
        }

        if (gd.port_id) {
            const [checkAlreadyExists, checkIfExists] = await Promise.all([
                this.prisma.active_days.findMany({
                    where: {
                        port_id: gd.port_id
                    }
                }),
                this.prisma.ports.findUnique({
                    where: {
                        port_id: gd.port_id
                    }
                })
            ])

            if (!(((checkAlreadyExists.length === 0 && isCreate) || (checkAlreadyExists.length !== 0 && !isCreate)) && checkIfExists))
                return false;

        }

        return true
    }
}