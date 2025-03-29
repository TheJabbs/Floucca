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
exports.BoatDetailsServices = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let BoatDetailsServices = class BoatDetailsServices {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllBoatDetails() {
        const boat_details = await this.prisma.boat_details.findMany({
            select: {
                boat_id: true,
                fleet_owner: true,
                fleet_hp: true,
                fleet_crew: true,
                fleet_max_weight: true,
                fleet_length: true,
                fleet_registration: true,
            },
        });
        if (!boat_details || boat_details.length === 0) {
            throw new common_1.NotFoundException('No boat details found');
        }
        return boat_details;
    }
    async getBoatDetailsByBDID(boat_details_id) {
        console.log(boat_details_id);
        const boat_details = await this.prisma.boat_details.findUnique({
            where: {
                boat_id: boat_details_id,
            },
            select: {
                boat_id: true,
                fleet_owner: true,
                fleet_hp: true,
                fleet_crew: true,
                fleet_max_weight: true,
                fleet_length: true,
                fleet_registration: true,
            },
        });
        if (!boat_details) {
            throw new common_1.NotFoundException('Boat details not found');
        }
        return boat_details;
    }
    async getBoatDetailByFleetOwner(fleet_owner) {
        const boat_details = await this.prisma.boat_details.findFirst({
            where: { fleet_owner: fleet_owner },
            select: {
                boat_id: true,
                fleet_owner: true,
                fleet_hp: true,
                fleet_crew: true,
                fleet_max_weight: true,
                fleet_length: true,
                fleet_registration: true,
            },
        });
        return boat_details;
    }
    async createBoatDetails(newBoatDetails) {
        const boat = await this.prisma.boat_details.create({
            data: newBoatDetails
        });
        return {
            message: 'Boat details created successfully',
            data: boat
        };
    }
    async updateBoatDetails() { }
    async deleteBoatDetails(BoatDetailsId) {
        const boatDetails = await this.prisma.boat_details.findUnique({
            where: { boat_id: BoatDetailsId },
        });
        if (!boatDetails) {
            throw new common_1.NotFoundException('Boat details not found');
        }
        await this.prisma.boat_details.delete({
            where: { boat_id: BoatDetailsId },
        });
        return {
            message: 'Boat details deleted successfully'
        };
    }
    async validateIds(fleetSensesIds, landingIds) {
        const [validFleetSenses, validLanding] = await Promise.all([
            this.prisma.fleet_senses.findMany({
                where: {
                    fleet_senses_id: { in: fleetSensesIds },
                },
            }),
            this.prisma.landing.findMany({
                where: {
                    landing_id: { in: landingIds },
                },
            }),
        ]);
        if (validFleetSenses.length !== fleetSensesIds.length) {
            throw new Error('One or more fleet senses IDs are invalid');
        }
        if (validLanding.length !== landingIds.length) {
            throw new Error('One or more landing IDs are invalid');
        }
    }
};
exports.BoatDetailsServices = BoatDetailsServices;
exports.BoatDetailsServices = BoatDetailsServices = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BoatDetailsServices);
//# sourceMappingURL=boat_detail.service.js.map