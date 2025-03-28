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
exports.LandingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const filterToFilteredInterface_mapper_1 = require("../fish/mapper/filterToFilteredInterface.mapper");
let LandingsService = class LandingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllLandings() {
        const landings = await this.prisma.landing.findMany();
        if (!landings || landings.length === 0) {
            throw new common_1.NotFoundException('No landings found');
        }
        return landings;
    }
    async getLandingById(id) {
        const landing = await this.prisma.landing.findUnique({
            where: { landing_id: id },
        });
        if (!landing) {
            throw new common_1.NotFoundException('No landing found');
        }
        return landing;
    }
    async createLanding(landing) {
        if (!await this.validate(landing)) {
            const newLanding = await this.prisma.landing.create({
                data: landing,
            });
            return {
                message: 'Landing created',
                data: newLanding
            };
        }
    }
    async deleteLanding(id) {
        const landing = await this.getLandingById(id);
        if (!landing) {
            return {
                message: 'Landing not found',
                data: null
            };
        }
    }
    async updateLanding(id, landing) {
        const checkLanding = await this.getLandingById(id);
        if (!checkLanding) {
            return {
                message: 'Landing not found',
                data: null
            };
        }
        if (!await this.validate(landing)) {
            const updatedLanding = await this.prisma.landing.update({
                where: { landing_id: id },
                data: landing,
            });
            return {
                message: 'Landing updated',
                data: updatedLanding
            };
        }
    }
    async createLandingForm(l) {
        let fishError = 0, gearError = 0, senseError = 0;
        let newPeriod = await this.prisma.period.findFirst({
            orderBy: { period_date: 'desc' }
        }) || await this.prisma.period.create({
            data: { period_date: new Date() },
            select: { period_date: true, period_status: true }
        });
        l.form.period_date = newPeriod.period_date;
        return await this.prisma.$transaction(async (prisma) => {
            const boatDetails = await prisma.boat_details.create({ data: l.boat_details });
            l.form.boat_detail = boatDetails.boat_id;
            const form = await prisma.form.create({ data: l.form });
            if (!form)
                throw new Error("Failed to create form data missing");
            let landing = null;
            if (l.landing) {
                l.landing.form_id = form.form_id;
                landing = await prisma.landing.create({ data: l.landing });
            }
            const [gears, species] = await Promise.all([
                prisma.gear.findMany({ select: { gear_code: true } }),
                prisma.specie.findMany({ select: { specie_code: true } })
            ]);
            let effort = null;
            if (l.effort && landing) {
                l.effort.landing_id = landing.landing_id;
                effort = await prisma.effort_today.create({ data: l.effort });
            }
            if (l.gearDetail && effort) {
                const gearDetailsPromises = l.gearDetail.map(async (g) => {
                    if (gears.some(gear => gear.gear_code === g.gear_code)) {
                        g.effort_today_id = effort.effort_today_id;
                        return prisma.gear_details.create({ data: g });
                    }
                    else {
                        gearError++;
                    }
                });
                await Promise.all(gearDetailsPromises);
            }
            if (l.fish && landing) {
                const fishPromises = l.fish.map(async (f) => {
                    if (species.some(specie => specie.specie_code === f.specie_code) &&
                        gears.some(gear => gear.gear_code === f.gear_code)) {
                        f.landing_id = landing.landing_id;
                        return prisma.fish.create({ data: f });
                    }
                    else {
                        fishError++;
                    }
                });
                await Promise.all(fishPromises);
            }
            if (l.lastw) {
                const lastwPromises = l.lastw.map(async (s) => {
                    if (gears.some(gear => gear.gear_code === s.gear_code)) {
                        s.form_id = form.form_id;
                        return prisma.sense_lastw.create({ data: s });
                    }
                    else {
                        senseError++;
                    }
                });
                await Promise.all(lastwPromises);
            }
            return {
                message: `Landing form created successfully. Errors - Fish: ${fishError}, Gear: ${gearError}, Sense: ${senseError}`,
                data: null
            };
        }).catch(async (error) => {
            await this.prisma.boat_details.delete({ where: { boat_id: l.form.boat_detail } });
            return { message: `Failed to create landing form: ${error.message}`, data: null };
        });
    }
    async getLandingsByFilter(filter) {
        const { period, gear_code, port_id, coop, region, specie_code } = filter;
        if (!port_id && !region && !coop) {
            throw new common_1.NotFoundException('No port, region or coop found');
        }
        const landings = await this.prisma.landing.findMany({
            distinct: ['form_id'],
            where: {
                form: {
                    period_date: period,
                    port_id: port_id ? { in: port_id } : undefined,
                    ports: {
                        coop_code: coop ? { in: coop } : undefined,
                        coop: {
                            region_code: region ? { in: region } : undefined
                        }
                    }
                },
                fish: {
                    some: {
                        gear_code: gear_code ? { in: gear_code } : undefined,
                        specie_code: specie_code ? { in: specie_code } : undefined
                    }
                }
            },
            select: {
                form: {
                    select: {
                        port_id: true,
                        form_id: true,
                    }
                },
                fish: {
                    select: {
                        specie_code: true,
                        fish_weight: true,
                        fish_quantity: true,
                        fish_length: true,
                        price: true,
                        specie: {
                            select: {
                                specie_name: true
                            }
                        }
                    }
                }
            }
        });
        if (!landings || landings.length === 0) {
            throw new common_1.NotFoundException('No landings found');
        }
        return (0, filterToFilteredInterface_mapper_1.filterToFilteredInterfaceMapper)(landings);
    }
    async validate(d) {
        if (d.form_id) {
            const form = await this.prisma.form.findUnique({
                where: { form_id: d.form_id },
            });
            if (!form) {
                return false;
            }
        }
    }
};
exports.LandingsService = LandingsService;
exports.LandingsService = LandingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LandingsService);
//# sourceMappingURL=landings.service.js.map