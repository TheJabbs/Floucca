import {Injectable} from "@nestjs/common";
import {ResponseMessage} from "../../shared/interface/response.interface";
import {GetAllPeriodInterface} from "./interface/getAllPeriod.interface";
import {UpdateGearDetailDto} from "../gear_detail/dto/UpdateGearDetail.dto";
import {PrismaService} from "../../prisma/prisma.service";


@Injectable()
export class PeriodService {

    constructor(private readonly prisma: PrismaService) {
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

    async updatePeriod(periodId: Date, updatedPeriod: UpdateGearDetailDto): Promise<ResponseMessage<any>> {
        try {
            await this.prisma.period.update({
                where: {
                    period_date: periodId
                },
                data: updatedPeriod
            });
            return {
                message: 'Period updated successfully.'
            };
        } catch (e) {
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

}