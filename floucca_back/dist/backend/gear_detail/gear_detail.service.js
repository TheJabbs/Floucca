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
exports.GearDetailService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const gear_service_1 = require("../gear/gear.service");
const effort_today_service_1 = require("../effort_today/effort_today.service");
let GearDetailService = class GearDetailService {
    constructor(prisma, gearService, effortToday) {
        this.prisma = prisma;
        this.gearService = gearService;
        this.effortToday = effortToday;
    }
    async getAllGearDetail() {
        const gear_detail = await this.prisma.gear_details.findMany();
        if (!gear_detail || gear_detail.length === 0) {
            throw new common_1.NotFoundException('No gear detail found');
        }
        return gear_detail;
    }
    async getGearDetailById(id) {
        const gear_detail = await this.prisma.gear_details.findUnique({
            where: { detail_id: id },
        });
        if (!gear_detail) {
            throw new common_1.NotFoundException('No gear detail found');
        }
        return gear_detail;
    }
    async createGearDetail(gear_detail) {
        const isValid = await this.validate(gear_detail);
        if (!isValid) {
            return {
                message: 'Invalid gear detail',
                data: null
            };
        }
        const newGearDetail = await this.prisma.gear_details.create({
            data: gear_detail,
        });
        return {
            message: 'Gear detail created',
            data: newGearDetail
        };
    }
    async deleteGearDetail(id) {
        const gear_detail = await this.getGearDetailById(id);
        if (!gear_detail) {
            return {
                message: 'Gear detail not found',
                data: null
            };
        }
        await this.prisma.gear_details.delete({
            where: { detail_id: id }
        });
        return {
            message: 'Gear detail deleted',
            data: gear_detail
        };
    }
    async updateGearDetail(id, gear_detail) {
        const checkGearDetail = await this.getGearDetailById(id);
        if (!checkGearDetail) {
            return {
                message: 'Gear detail not found',
                data: null
            };
        }
        const isValid = await this.validate(gear_detail);
        if (!isValid) {
            return {
                message: 'Invalid gear detail',
                data: null
            };
        }
        const updatedGearDetail = await this.prisma.gear_details.update({
            where: { detail_id: id },
            data: gear_detail
        });
        return {
            message: 'Gear detail updated',
            data: updatedGearDetail
        };
    }
    async validate(gear_detail) {
        if (gear_detail.gear_code) {
            const checkGearCode = await this.gearService.getGearById(gear_detail.gear_code);
            if (!checkGearCode) {
                return false;
            }
        }
        if (gear_detail.effort_today_id) {
            const checkEffortTodayId = await this.effortToday.getEffortTodayById(gear_detail.effort_today_id);
            if (!checkEffortTodayId) {
                return false;
            }
        }
        return true;
    }
};
exports.GearDetailService = GearDetailService;
exports.GearDetailService = GearDetailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        gear_service_1.GearService,
        effort_today_service_1.EffortTodayService])
], GearDetailService);
//# sourceMappingURL=gear_detail.service.js.map