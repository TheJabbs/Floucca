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
exports.CoopService = void 0;
const common_1 = require("@nestjs/common");
const coop_mapper_1 = require("./mapper/coop.mapper");
const prisma_service_1 = require("../../prisma/prisma.service");
let CoopService = class CoopService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllCoops() {
        try {
            const coops = await this.prisma.coop.findMany();
            if (!coops)
                throw new common_1.NotFoundException("Coops not found");
            return coops.map((coop) => (0, coop_mapper_1.mapCoopToReturnCoopInterface)(coop));
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getCoopById(coop_code) {
        try {
            const coop = await this.prisma.coop.findUnique({ where: { coop_code: coop_code } });
            if (!coop) {
                throw new common_1.NotFoundException("Coop for id " + coop_code + " not found.");
            }
            return (0, coop_mapper_1.mapCoopToReturnCoopInterface)(coop);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async createCoop(coopToCreate) {
        try {
            const coop = await this.prisma.coop.findUnique({
                where: { coop_code: coopToCreate.coop_code },
            });
            if (coop)
                throw new common_1.NotFoundException("Coop already exists");
            const newCoop = await this.prisma.coop.create({
                data: {
                    coop_code: coopToCreate.coop_code,
                    region_code: coopToCreate.region_code,
                    coop_name: coopToCreate.coop_name
                }
            });
            return (0, coop_mapper_1.mapCoopToReturnCoopInterface)(newCoop);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async updateCoop(coop_code, coopToUpdate) {
        try {
            const coop = await this.prisma.coop.findUnique({
                where: { coop_code: coop_code },
            });
            if (!coop)
                throw new common_1.NotFoundException("Coop not found");
            const updatedCoop = await this.prisma.coop.update({
                where: { coop_code: coop_code },
                data: {
                    coop_code: coopToUpdate.coop_code,
                    region_code: coopToUpdate.region_code,
                    coop_name: coopToUpdate.coop_name
                }
            });
            return (0, coop_mapper_1.mapCoopToReturnCoopInterface)(updatedCoop);
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async deleteCoop(coop_code) {
        try {
            const coop = await this.prisma.coop.findUnique({
                where: { coop_code: coop_code },
            });
            if (!coop)
                throw new common_1.NotFoundException("Coop not found");
            await this.prisma.coop.delete({
                where: { coop_code: coop_code }
            });
            return (0, coop_mapper_1.mapCoopToReturnCoopInterface)(coop);
        }
        catch (error) {
            throw new Error(error);
        }
    }
};
exports.CoopService = CoopService;
exports.CoopService = CoopService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CoopService);
//# sourceMappingURL=coop.service.js.map