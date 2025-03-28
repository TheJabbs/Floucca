"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EffortTodayService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let EffortTodayService = class EffortTodayService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllEffortToday() {
        try {
            const effort_today = await this.prisma.effort_today.findMany();
            return effort_today;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getEffortTodayById(id) {
        try {
            const effort_today = await this.prisma.effort_today.findUnique({
                where: { effort_today_id: id }
            });
            if (!effort_today) {
                throw new Error("Effort today not found");
            }
            return effort_today;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async createEffortToday(effort_today) {
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
            };
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async updateEffortToday(id, effort_today) {
        try {
            const updatedEffortToday = await this.prisma.effort_today.update({
                where: { effort_today_id: id },
                data: {
                    hours_fished: effort_today.hours_fished,
                    landing_id: effort_today.landing_id
                }
            });
            return {
                message: "Effort today updated successfully",
                data: updatedEffortToday
            };
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async deleteEffortToday(id) {
        try {
            const deletedEffortToday = await this.prisma.effort_today.delete({
                where: { effort_today_id: id }
            });
            return deletedEffortToday;
        }
        catch (error) {
            throw new Error(error);
        }
    }
};
exports.EffortTodayService = EffortTodayService;
exports.EffortTodayService = EffortTodayService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EffortTodayService);
//# sourceMappingURL=effort_today.service.js.map