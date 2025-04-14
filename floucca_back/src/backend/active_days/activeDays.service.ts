import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {CreateActiveDaysDto} from "./dto/createActiveDays.dto";
import {GetAllActiveDaysInterface} from "./interface/getAllActiveDays.interface";

@Injectable()
export class ActiveDaysService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getAllActiveDays(): Promise<GetAllActiveDaysInterface[]> {
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

    async getActiveDaysByPortId(port_id: number, period: string) {
        const ad = await this.prisma.active_days.findFirst({
            where: {
                port_id: port_id,
                period_date: period
            }
        });

        if (!ad) {
            throw new Error('No active days found');
        }

        return ad;
    }

    async test(){
        let newPeriod = await this.prisma.period.findFirst({
            orderBy: {period_date: 'desc'}
        })

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
                active_days: 28,
                gear_code: code
            }))
        );

        await this.prisma.active_days.createMany({ data });
    }

    //================================================================
    async validate(gd: any, isCreate: boolean) {
        if (isCreate) {
            const check = await this.prisma.active_days.findFirst({
                where: {
                    port_id: gd.port_id,
                    period_date: gd.period_date,
                    gear_code: gd.gear_code
                }
            });
            if (check) {
                return false;
            }
        }

        return true;
    }
}