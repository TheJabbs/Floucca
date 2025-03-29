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
exports.RegionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RegionService = class RegionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateRegion(region_code) {
        console.log(`Validating region with code: ${region_code}`);
        const region = await this.prisma.region.findUnique({
            where: { region_code },
        });
        return !!region;
    }
    async validateRegionData(createRegionDto) {
        console.log("Validating region data:", createRegionDto);
        const existingRegion = await this.prisma.region.findUnique({
            where: { region_code: createRegionDto.region_code },
        });
        if (existingRegion) {
            throw new common_1.ConflictException(`Region with code ${createRegionDto.region_code} already exists.`);
        }
    }
    async createRegion(createRegionDto) {
        console.log("Creating region with data:", createRegionDto);
        await this.validateRegionData(createRegionDto);
        return this.prisma.region.create({
            data: {
                region_code: createRegionDto.region_code,
                region_name: createRegionDto.region_name,
            },
        });
    }
    async findAllRegions() {
        console.log("Fetching all regions...");
        return this.prisma.region.findMany();
    }
    async findRegionById(region_code) {
        console.log(`Fetching region with ID: ${region_code}`);
        return this.prisma.region.findUnique({
            where: { region_code },
        });
    }
    async updateRegion(region_code, updateRegionDto) {
        console.log(`Updating region with ID: ${region_code} with data:`, updateRegionDto);
        const regionExists = await this.validateRegion(region_code);
        if (!regionExists) {
            throw new common_1.NotFoundException(`Region with code ${region_code} not found.`);
        }
        await this.validateRegionData(updateRegionDto);
        return this.prisma.region.update({
            where: { region_code },
            data: updateRegionDto,
        });
    }
    async deleteRegion(region_code) {
        console.log(`Deleting region with ID: ${region_code}`);
        const regionExists = await this.validateRegion(region_code);
        if (!regionExists) {
            throw new common_1.NotFoundException(`Region with code ${region_code} not found.`);
        }
        await this.prisma.coop.deleteMany({
            where: { region_code },
        });
        return this.prisma.region.delete({
            where: { region_code },
        });
    }
};
exports.RegionService = RegionService;
exports.RegionService = RegionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RegionService);
//# sourceMappingURL=region.service.js.map