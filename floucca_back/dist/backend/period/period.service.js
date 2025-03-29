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
exports.PeriodService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PeriodService = class PeriodService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllPeriod() {
        return this.prisma.period.findMany();
    }
    async getPeriodById(periodId) {
        return this.prisma.period.findUnique({
            where: {
                period_date: periodId
            }
        });
    }
    async updatePeriod(periodId, updatedPeriod) {
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
        }
        catch (e) {
            return {
                message: 'Failed to update period.'
            };
        }
    }
    async deletePeriod(periodId) {
        try {
            await this.prisma.period.delete({
                where: {
                    period_date: periodId
                }
            });
            return {
                message: 'Period deleted successfully.'
            };
        }
        catch (e) {
            return {
                message: 'Failed to delete period.'
            };
        }
    }
};
exports.PeriodService = PeriodService;
exports.PeriodService = PeriodService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PeriodService);
//# sourceMappingURL=period.service.js.map