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
exports.FishService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FishService = class FishService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async getAllFish() {
        const fish = await this.prismaService.fish.findMany();
        if (!fish || fish.length === 0) {
            throw new common_1.NotFoundException("No fish records found");
        }
        return fish;
    }
    async getFishById(fish_id) {
        const check = this.prismaService.fish.findUnique({
            where: { fish_id: fish_id }
        });
        if (!check)
            throw new common_1.NotFoundException("Fish not found");
        return check;
    }
    async createFish(fish) {
        if (await this.validate(fish)) {
            const newFish = await this.prismaService.fish.create({
                data: fish
            });
            return {
                message: "Fish created successfully",
                data: newFish
            };
        }
    }
    async updateFish(fish_id, fish) {
        const check = this.prismaService.fish.findUnique({
            where: { fish_id: fish_id }
        });
        if (!check)
            throw new common_1.NotFoundException("Fish not found");
        if (await this.validate(fish)) {
            const updatedFish = await this.prismaService.fish.update({
                where: { fish_id: fish_id },
                data: fish
            });
            return {
                message: "Fish updated successfully",
                data: updatedFish
            };
        }
    }
    async deleteFish(fish_id) {
        const check = this.prismaService.fish.findUnique({
            where: { fish_id: fish_id }
        });
        if (!check)
            throw new common_1.NotFoundException("Fish not found");
        return this.prismaService.fish.delete({
            where: { fish_id: fish_id }
        });
    }
    async getFishSpecieByGear(period, gear_code) {
        const species = await this.prismaService.fish.findMany({
            distinct: ['specie_code'],
            where: {
                gear_code: { in: gear_code },
                landing: {
                    form: {
                        period_date: period
                    }
                }
            },
            select: { specie_code: true }
        });
        return species.map(specie => specie.specie_code);
    }
    async validate(d) {
        if (d.specie_code) {
            const check = await this.prismaService.specie.findUnique({
                where: { specie_code: d.specie_code }
            });
            if (!check)
                return false;
        }
        if (d.landing_id) {
            const check = await this.prismaService.landing.findUnique({
                where: { landing_id: d.landing_id }
            });
            if (!check)
                return false;
        }
        if (d.gear_code) {
            const check = await this.prismaService.gear.findUnique({
                where: { gear_code: d.gear_code }
            });
            if (!check)
                return false;
        }
        return true;
    }
};
exports.FishService = FishService;
exports.FishService = FishService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FishService);
//# sourceMappingURL=fish.service.js.map