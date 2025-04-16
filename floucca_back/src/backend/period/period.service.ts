import {Injectable} from "@nestjs/common";
import {ResponseMessage} from "../../shared/interface/response.interface";
import {GetAllPeriodInterface} from "./interface/get_all_period.interface";
import {UpdateGearDetailDto} from "../gear_detail/dto/update_gear_detail.dto";
import {PrismaService} from "../../prisma/prisma.service";
import {mapPeriodWithActiveDays} from "./mapper/mapPeriodWithActiveDays";
import {ActiveDaysService} from "../active_days/activeDays.service";
import {UpdatePeriodAndActiveDaysDto} from "./dto/UpdatePeriodAndActiveDays.dto";
import {UpdatePeriodDto} from "./dto/update_period.dto";


@Injectable()
export class PeriodService {

    constructor(private readonly prisma: PrismaService,
                private readonly activeDaysService: ActiveDaysService) {
    }


    async getAllPeriod(): Promise<GetAllPeriodInterface[]> {
        return this.prisma.period.findMany();
    }

    async getPeriodById(periodId: Date): Promise<GetAllPeriodInterface> {
        return this.prisma.period.findUnique({
            where: {
                period_date: periodId
            }
        });
    }

    async updatePeriod( updatedPeriod: UpdatePeriodDto): Promise<ResponseMessage<any>> {
        const date = new Date(updatedPeriod.period_date);

        try {
            await this.prisma.period.update({
                where: {
                    period_date: date.toISOString()
                },
                data: {
                    period_status: updatedPeriod.period_status,
                }
            });
            return {
                message: 'Period updated successfully.'
            };
        } catch (e) {
            console.error(e);
            return {
                message: 'Failed to update period.'
            };
        }
    }

    async deletePeriod(periodId: Date) {
        try {
            await this.prisma.period.delete({
                where: {
                    period_date: periodId
                }
            });
            return {
                message: 'Period deleted successfully.'
            };
        } catch (e) {
            return {
                message: 'Failed to delete period.'
            };
        }
    }

    //===================================================================

    async getPeriodsWithActiveDays(){
        const [periods , activeDays] = await Promise.all([
            this.prisma.period.findMany(),
            this.prisma.active_days.findMany()
        ])

        return mapPeriodWithActiveDays(periods, activeDays);
    }

    // async updatePeriodWithActiveDays(toUpdate: UpdatePeriodAndActiveDaysDto[]): Promise<ResponseMessage<any>> {
    //
    //
    //     const periodUpdatePromises = periods.map(async (period) => {
    //         return this.prisma.period.update({
    //             where: {
    //                 period_date: period.period_date
    //             },
    //             data: period.period
    //         });
    //     });
    //
    //     const activeDaysUpdatePromises = activeDays.map(async (activeDay) => {
    //         return this.activeDaysService.updateActiveDays(activeDay.activeDays_id, activeDay.activeDays);
    //     });
    //
    //     await Promise.all([...periodUpdatePromises, ...activeDaysUpdatePromises]);
    //
    //     return {
    //         message: 'Period and Active Days updated successfully.'
    //     };
    //
    // }

}