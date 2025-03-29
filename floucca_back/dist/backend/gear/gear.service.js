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
exports.GearService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let GearService = class GearService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllGear() {
        const gear = await this.prisma.gear.findMany();
        if (!gear || gear.length === 0) {
            throw new common_1.NotFoundException('No gear found');
        }
        return gear;
    }
    async getGearById(id) {
        const gear = await this.prisma.gear.findUnique({
            where: { gear_code: id },
            select: {
                gear_code: true,
                gear_name: true,
                equipment_id: true,
                equipment_name: true,
            }
        });
        if (!gear) {
            throw new common_1.NotFoundException('No gear found');
        }
        return gear;
    }
    async createGear(gear) {
        const checkGear = await this.getGearById(gear.gear_code);
        if (checkGear) {
            return {
                message: 'Gear already exists',
                data: checkGear
            };
        }
        const newGear = await this.prisma.gear.create({
            data: gear,
        });
        return {
            message: 'Gear created successfully',
            data: newGear
        };
    }
    async updateGear(id, gear) {
        const checkGear = await this.getGearById(id);
        if (!checkGear) {
            return {
                message: 'Gear not found'
            };
        }
        const updatedGear = await this.prisma.gear.update({
            where: { gear_code: id },
            data: gear
        });
        return {
            message: 'Gear updated successfully',
        };
    }
    async deleteGear(id) {
        const checkGear = await this.getGearById(id);
        if (!checkGear) {
            return {
                message: 'Gear not found'
            };
        }
        await this.prisma.gear.delete({
            where: { gear_code: id }
        });
        return {
            message: 'Gear deleted successfully',
        };
    }
};
exports.GearService = GearService;
exports.GearService = GearService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GearService);
//# sourceMappingURL=gear.service.js.map