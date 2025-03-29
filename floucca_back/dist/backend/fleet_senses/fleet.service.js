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
exports.FleetService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let FleetService = class FleetService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllFleet() {
        const fleet = await this.prisma.fleet_senses.findMany({
            select: {
                fleet_senses_id: true,
                form_id: true,
                gear_usage: {
                    select: {
                        gear_code: true,
                        months: true
                    }
                }
            }
        });
        if (!fleet || fleet.length === 0) {
            throw new common_1.NotFoundException('No fleet senses found');
        }
        return fleet;
    }
    async getFleetById(id) {
        const fleet = await this.prisma.fleet_senses.findUnique({
            where: { fleet_senses_id: id },
            select: {
                fleet_senses_id: true,
                form_id: true,
                gear_usage: {
                    select: {
                        gear_code: true,
                        months: true,
                    }
                }
            }
        });
        if (!fleet) {
            throw new common_1.NotFoundException('No fleet senses found');
        }
        return fleet;
    }
    async createFleet(fleet) {
        if (!await this.validate(fleet.form_id)) {
            return {
                message: "Form or boat details not found"
            };
        }
        const newFleet = await this.prisma.fleet_senses.create({
            data: {
                form_id: fleet.form_id
            }
        });
        return {
            message: "Fleet created",
        };
    }
    async updateFleet(id, fleet) {
        if (!await this.validate(fleet.form_id)) {
            return {
                message: "Form or boat details not found"
            };
        }
        const updatedFleet = await this.prisma.fleet_senses.update({
            where: { fleet_senses_id: id },
            data: {
                form_id: fleet.form_id
            }
        });
    }
    async deleteFleet(id) {
        const check = await this.prisma.fleet_senses.findUnique({
            where: { fleet_senses_id: id }
        });
        if (!check) {
            return {
                message: "Fleet not found"
            };
        }
        return {
            message: "Fleet deleted",
        };
    }
    async getAllFleetByDate(start, end) {
        const fleet = await this.prisma.fleet_senses.findMany({
            where: {
                form: {
                    creation_time: {
                        gte: start,
                        lte: end
                    }
                }
            },
            include: {
                form: true,
                gear_usage: {
                    select: {
                        gear_code: true,
                        months: true
                    }
                }
            }
        });
        if (!fleet || fleet.length === 0) {
            throw new common_1.NotFoundException('No fleet senses found');
        }
        return fleet;
    }
    async validate(form_id) {
        const form = await this.prisma.form.findFirst({
            where: {
                form_id: form_id
            }
        });
        return !(!form);
    }
    async createFleetSensesForm(content) {
        return await this.prisma.$transaction(async (prisma) => {
            let newestPeriod = await prisma.period.findFirst({
                orderBy: { period_date: 'desc' }
            });
            if (!newestPeriod) {
                newestPeriod = await prisma.period.create({
                    data: { period_date: new Date() }
                });
            }
            content.form.period_date = newestPeriod.period_date;
            const boatDetails = await prisma.boat_details.create({ data: content.boatDetails });
            content.form.boat_detail = boatDetails.boat_id;
            const form = await prisma.form.create({ data: content.form });
            if (!form)
                throw new Error("Failed to create form");
            const sense = await prisma.fleet_senses.create({ data: { form_id: form.form_id } });
            if (sense && content.gearUsage.length > 0) {
                await Promise.all(content.gearUsage.map(gear => prisma.gear_usage.create({
                    data: {
                        fleet_senses_id: sense.fleet_senses_id,
                        gear_code: gear.gear_code,
                        months: gear.months
                    }
                })));
            }
            return { message: 'Fleet senses form created successfully' };
        }).catch(async (error) => {
            console.error("Transaction failed:", error);
            return { message: `Failed to create fleet senses form: ${error.message}` };
        });
    }
};
exports.FleetService = FleetService;
exports.FleetService = FleetService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FleetService);
//# sourceMappingURL=fleet.service.js.map