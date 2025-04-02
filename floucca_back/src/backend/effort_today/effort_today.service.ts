import {Injectable} from "@nestjs/common";
import {EffortTodayInterface} from "./interface/effort_today.interface";
import {CreateEffortTodayInterface} from "./interface/create_update_effort_today.interface";
import {CreateEffortTodayDto} from "./dto/effort_today.dto";
import {PrismaService} from "../../prisma/prisma.service";
import {UpdateEffortDto} from "./dto/update_effort.dto";
import {ResponseMessage} from "../../shared/interface/response.interface";

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

    async createEffortToday(effort_today: CreateEffortTodayDto): Promise<ResponseMessage<any>> {
        try {
            const newEffortToday = await this.prisma.effort_today.create({
                data: {
                    hours_fished: effort_today.hours_fished,
                    landing_id: effort_today.landing_id
                }
            });
            return {
                message: "Effort today created successfully",
                data: newEffortToday
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateEffortToday(id: number, effort_today: UpdateEffortDto): Promise<ResponseMessage<any>> {
        try {
            const updatedEffortToday = await this.prisma.effort_today.update({
                where: {effort_today_id: id},
                data: {
                    hours_fished: effort_today.hours_fished,
                    landing_id: effort_today.landing_id
                }
            });
            return {
                message: "Effort today updated successfully",
                data: updatedEffortToday
            }
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