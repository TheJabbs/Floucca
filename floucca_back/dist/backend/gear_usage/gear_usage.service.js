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
exports.GearUsageService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let GearUsageService = class GearUsageService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllGearUsage() {
        const gearUsage = await this.prisma.gear_usage.findMany();
        if (!gearUsage || gearUsage.length === 0) {
            throw new common_1.NotFoundException('No gear usage found');
        }
        return gearUsage;
    }
    async getGearUsageById(id) {
        const gearUsage = await this.prisma.gear_usage.findUnique({
            where: { gear_usage_id: id }
        });
        if (!gearUsage) {
            throw new common_1.NotFoundException('No gear usage found');
        }
        return gearUsage;
    }
    async createGearUsage(gearUsage) {
        if (!await this.validate(gearUsage.fleet_senses_id, gearUsage.gear_code)) {
            return {
                message: 'Fleet or gear not found'
            };
        }
        const newGearUsage = await this.prisma.gear_usage.create({
            data: {
                fleet_senses_id: gearUsage.fleet_senses_id,
                gear_code: gearUsage.gear_code,
                months: gearUsage.months
            }
        });
        return {
            message: 'Gear usage created successfully',
            data: newGearUsage
        };
    }
    async updateGearUsage(id, gearUsage) {
        const checkGearUsage = await this.prisma.gear_usage.findUnique({
            where: { gear_usage_id: id }
        });
        if (!checkGearUsage) {
            return {
                message: 'Gear usage not found',
            };
        }
        if (!await this.validate(gearUsage.fleet_senses_id, gearUsage.gear_code)) {
            return {
                message: 'Fleet or gear not found'
            };
        }
        const updatedGearUsage = await this.prisma.gear_usage.update({
            where: { gear_usage_id: id },
            data: {
                fleet_senses_id: gearUsage.fleet_senses_id,
                gear_code: gearUsage.gear_code,
                months: gearUsage.months
            }
        });
        return {
            message: 'Gear usage updated successfully',
            data: updatedGearUsage
        };
    }
    async deleteGearUsage(id) {
        const checkGearUsage = await this.prisma.gear_usage.findUnique({
            where: { gear_usage_id: id }
        });
        if (!checkGearUsage) {
            return {
                message: 'Gear usage not found',
            };
        }
        await this.prisma.gear_usage.delete({
            where: { gear_usage_id: id }
        });
    }
    async validate(fleet_senses_id, gear_code) {
        const checkFleet = await this.prisma.fleet_senses.findUnique({
            where: { fleet_senses_id: fleet_senses_id }
        });
        const checkGear = await this.prisma.gear.findUnique({
            where: { gear_code: gear_code }
        });
        return !(!checkFleet || !checkGear);
    }
};
exports.GearUsageService = GearUsageService;
exports.GearUsageService = GearUsageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GearUsageService);
//# sourceMappingURL=gear_usage.service.js.map