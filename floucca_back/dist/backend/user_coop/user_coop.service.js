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
exports.UserCoopService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let UserCoopService = class UserCoopService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateUserCoop(user_id, coop_code) {
        const userExists = await this.prisma.users.findUnique({
            where: { user_id },
        });
        const coopExists = await this.prisma.coop.findUnique({
            where: { coop_code },
        });
        return !!(userExists && coopExists);
    }
    async createUserCoop(createUserCoopDto) {
        console.log("Received data for creation:", createUserCoopDto);
        const isValid = await this.validateUserCoop(createUserCoopDto.user_id, createUserCoopDto.coop_code);
        if (!isValid) {
            throw new common_1.NotFoundException("Either user_id or coop_code does not exist.");
        }
        return this.prisma.user_coop.create({
            data: createUserCoopDto,
        });
    }
    async findAllUserCoops() {
        return this.prisma.user_coop.findMany();
    }
    async findUserCoopById(user_coop_id) {
        return this.prisma.user_coop.findUnique({
            where: { user_coop_id },
        });
    }
    async updateUserCoop(user_coop_id, updateUserCoopDto) {
        console.log("Received data for update:", updateUserCoopDto);
        const userCoopExists = await this.findUserCoopById(user_coop_id);
        if (!userCoopExists) {
            throw new common_1.NotFoundException(`UserCoop with ID ${user_coop_id} not found.`);
        }
        const isValid = await this.validateUserCoop(updateUserCoopDto.user_id, updateUserCoopDto.coop_code);
        if (!isValid) {
            throw new common_1.NotFoundException("Either user_id or coop_code does not exist.");
        }
        return this.prisma.user_coop.update({
            where: { user_coop_id },
            data: updateUserCoopDto,
        });
    }
    async deleteUserCoop(user_coop_id) {
        console.log("Deleting UserCoop with ID:", user_coop_id);
        const userCoopExists = await this.findUserCoopById(user_coop_id);
        if (!userCoopExists) {
            throw new common_1.NotFoundException(`UserCoop with ID ${user_coop_id} not found.`);
        }
        return this.prisma.user_coop.delete({
            where: { user_coop_id },
        });
    }
};
exports.UserCoopService = UserCoopService;
exports.UserCoopService = UserCoopService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserCoopService);
//# sourceMappingURL=user_coop.service.js.map