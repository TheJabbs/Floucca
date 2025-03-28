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
exports.SpecieService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SpecieService = class SpecieService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateSpecie(specie_code, checkExists = true) {
        const specie = await this.prisma.specie.findUnique({
            where: { specie_code },
        });
        if (checkExists && !specie) {
            throw new common_1.NotFoundException(`Specie with code ${specie_code} not found.`);
        }
        if (!checkExists && specie) {
            throw new common_1.ConflictException(`Specie with code ${specie_code} already exists.`);
        }
    }
    async createSpecie(createSpecieDto) {
        console.log("Received data for creation:", createSpecieDto);
        await this.validateSpecie(createSpecieDto.specie_code, false);
        return this.prisma.specie.create({
            data: createSpecieDto,
        });
    }
    async findAllSpecies() {
        return this.prisma.specie.findMany();
    }
    async findSpecieById(specie_code) {
        await this.validateSpecie(specie_code);
        return this.prisma.specie.findUnique({
            where: { specie_code },
        });
    }
    async updateSpecie(specie_code, updateSpecieDto) {
        console.log("Received data for update:", updateSpecieDto);
        await this.validateSpecie(specie_code);
        return this.prisma.specie.update({
            where: { specie_code },
            data: updateSpecieDto,
        });
    }
    async deleteSpecie(specie_code) {
        await this.validateSpecie(specie_code);
        console.log(`Deleting all fish entries with specie_code: ${specie_code}`);
        await this.prisma.fish.deleteMany({
            where: { specie_code },
        });
        console.log(`Deleting specie with code: ${specie_code}`);
        return this.prisma.specie.delete({
            where: { specie_code },
        });
    }
};
exports.SpecieService = SpecieService;
exports.SpecieService = SpecieService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SpecieService);
//# sourceMappingURL=species.service.js.map