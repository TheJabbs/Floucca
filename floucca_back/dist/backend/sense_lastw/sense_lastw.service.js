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
exports.SenseLastwService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SenseLastwService = class SenseLastwService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllSenseLastw() {
        const sense_lastw = await this.prisma.sense_lastw.findMany();
        if (!sense_lastw || sense_lastw.length === 0) {
            throw new common_1.NotFoundException('No sense_lastw records found');
        }
        return sense_lastw;
    }
    async getSenseLastwById(id) {
        const sense_lastw = await this.prisma.sense_lastw.findUnique({
            where: { sense_lastW_id: id },
        });
        if (!sense_lastw) {
            throw new common_1.NotFoundException('Sense lastw record not found');
        }
        return sense_lastw;
    }
    async createSenseLastw(sense_lastw) {
        if (sense_lastw.form_id || sense_lastw.gear_code) {
            if (!await this.validate(sense_lastw)) {
                const newSenseLastw = await this.prisma.sense_lastw.create({
                    data: sense_lastw,
                });
                return {
                    message: 'Sense lastw record created successfully',
                    data: newSenseLastw,
                };
            }
        }
        return {
            message: 'Invalid sense lastw record',
            data: null,
        };
    }
    async deleteSenseLastw(id) {
        const sense_lastw = await this.getSenseLastwById(id);
        if (!sense_lastw) {
            return {
                message: 'Sense lastw record not found',
                data: null,
            };
        }
        await this.prisma.sense_lastw.delete({
            where: { sense_lastW_id: id },
        });
        return {
            message: 'Sense lastw record deleted successfully',
            data: sense_lastw,
        };
    }
    async updateSenseLastw(id, sense_lastw) {
        const checkSenseLastw = await this.getSenseLastwById(id);
        if (!checkSenseLastw) {
            return {
                message: 'Sense lastw record not found',
                data: null,
            };
        }
        if (!await this.validate(sense_lastw)) {
            const updatedSenseLastw = await this.prisma.sense_lastw.update({
                where: { sense_lastW_id: id },
                data: sense_lastw,
            });
            return {
                message: 'Sense lastw record updated successfully',
                data: updatedSenseLastw,
            };
        }
    }
    async getEffortsByFilter(filter) {
        const { period, gear_code, port_id, region, coop } = filter;
        if (!port_id && !region && !coop) {
            throw new common_1.NotFoundException('No port, region or coop found');
        }
        const landings = await this.prisma.sense_lastw.findMany({
            where: {
                gear_code: gear_code ? { in: gear_code } : undefined,
                form: {
                    period_date: period,
                    port_id: port_id ? { in: port_id } : undefined,
                    ports: {
                        coop_code: coop ? { in: coop } : undefined,
                        coop: {
                            region_code: region ? { in: region } : undefined
                        }
                    }
                }
            },
            select: {
                gear_code: true,
                days_fished: true,
                form: {
                    select: {
                        form_id: true,
                        port_id: true,
                    }
                }
            }
        });
        if (!landings || landings.length === 0) {
            throw new common_1.NotFoundException('No landings found');
        }
        return landings;
    }
    async validate(d) {
        if (d.gear_code) {
            const gear = await this.prisma.gear.findUnique({
                where: { gear_code: d.gear_code }
            });
            if (!gear) {
                return false;
            }
        }
        if (d.landing_id) {
            const landing = await this.prisma.landing.findUnique({
                where: { landing_id: d.landing_id }
            });
            if (!landing) {
                return false;
            }
        }
    }
};
exports.SenseLastwService = SenseLastwService;
exports.SenseLastwService = SenseLastwService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SenseLastwService);
//# sourceMappingURL=sense_lastw.service.js.map