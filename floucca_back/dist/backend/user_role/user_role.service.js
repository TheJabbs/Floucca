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
exports.UserRoleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let UserRoleService = class UserRoleService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateUserRole(user_id, role_id) {
        const userExists = await this.prisma.users.findUnique({ where: { user_id } });
        const roleExists = await this.prisma.roles.findUnique({ where: { role_id } });
        if (!userExists) {
            throw new common_1.BadRequestException(`User with ID ${user_id} does not exist.`);
        }
        if (!roleExists) {
            throw new common_1.BadRequestException(`Role with ID ${role_id} does not exist.`);
        }
        return true;
    }
    async createUserRole(createUserRoleDto) {
        console.log("Creating User Role:", createUserRoleDto);
        const { user_id, role_id } = createUserRoleDto;
        await this.validateUserRole(user_id, role_id);
        return this.prisma.user_role.create({
            data: createUserRoleDto,
        });
    }
    async findAllUserRoles() {
        return this.prisma.user_role.findMany();
    }
    async findUserRoleById(user_role_id) {
        return this.prisma.user_role.findUnique({
            where: { user_role_id },
        });
    }
    async updateUserRole(user_role_id, updateUserRoleDto) {
        console.log("Updating User Role:", { user_role_id, ...updateUserRoleDto });
        const userRoleExists = await this.findUserRoleById(user_role_id);
        if (!userRoleExists) {
            throw new common_1.NotFoundException(`User Role with ID ${user_role_id} not found.`);
        }
        await this.validateUserRole(updateUserRoleDto.user_id, updateUserRoleDto.role_id);
        return this.prisma.user_role.update({
            where: { user_role_id },
            data: updateUserRoleDto,
        });
    }
    async deleteUserRole(user_role_id) {
        console.log("Deleting User Role ID:", user_role_id);
        const userRoleExists = await this.findUserRoleById(user_role_id);
        if (!userRoleExists) {
            throw new common_1.NotFoundException(`User Role with ID ${user_role_id} not found.`);
        }
        return this.prisma.user_role.delete({
            where: { user_role_id },
        });
    }
};
exports.UserRoleService = UserRoleService;
exports.UserRoleService = UserRoleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserRoleService);
//# sourceMappingURL=user_role.service.js.map