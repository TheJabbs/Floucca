import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {EffortTodayInterface} from "./interface/effort_today.interface";
import {CreateEffortTodayInterface} from "./interface/create_update_effort_today.interface";
import {EffortTodayDto} from "./dto/effort_today.Dto";
import {mapEffortToday} from "./mapper/effort_today.mapper";

@Injectable()
export class EffortTodayService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getAllEffortToday() {
        try {
            const effort_today = await this.prisma.effort_today.findMany();
            return effort_today;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getEffortTodayById(id: number): Promise<EffortTodayInterface> {
        try {
            const effort_today = await this.prisma.effort_today.findUnique({
                where: {effort_today_id: id}
            });
            if (!effort_today) {
                throw new Error("Effort today not found");
            }
            return effort_today;
        } catch (error) {
            throw new Error(error);
        }
    }

    async createEffortToday(effort_today: EffortTodayDto): Promise<CreateEffortTodayInterface> {
        try {
            const newEffortToday = await this.prisma.effort_today.create({
                data: {
                    hours_fished: effort_today.hours_fished,
                    detail_id: effort_today.detail_id,
                    landing_id: effort_today.landing_id
                }
            });
            return mapEffortToday(newEffortToday);
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateEffortToday(id: number, effort_today: EffortTodayDto): Promise<CreateEffortTodayInterface> {
        try {
            const updatedEffortToday = await this.prisma.effort_today.update({
                where: {effort_today_id: id},
                data: {
                    hours_fished: effort_today.hours_fished,
                    detail_id: effort_today.detail_id,
                    landing_id: effort_today.landing_id
                }
            });
            return mapEffortToday(updatedEffortToday);
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteEffortToday(id: number): Promise<EffortTodayInterface> {
        try {
            const deletedEffortToday = await this.prisma.effort_today.delete({
                where: {effort_today_id: id}
            });
            return deletedEffortToday;
        } catch (error) {
            throw new Error(error);
        }
    }

}