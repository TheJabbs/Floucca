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
exports.RoleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RoleService = class RoleService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validateRole(role_code) {
        const role = await this.prisma.roles.findUnique({
            where: { role_code },
        });
        return !!role;
    }
    async createRole(createRoleDto) {
        console.log("Creating role:", createRoleDto);
        const roleExists = await this.validateRole(createRoleDto.role_code);
        if (roleExists) {
            throw new common_1.ConflictException(`Role with code ${createRoleDto.role_code} already exists.`);
        }
        return this.prisma.roles.create({
            data: createRoleDto,
        });
    }
    async findAllRoles() {
        console.log("Fetching all roles");
        return this.prisma.roles.findMany();
    }
    async findRoleById(role_id) {
        console.log(`Fetching role with ID: ${role_id}`);
        return this.prisma.roles.findUnique({
            where: { role_id },
        });
    }
    async updateRole(role_id, updateRoleDto) {
        console.log(`Updating role ${role_id} with data:`, updateRoleDto);
        const roleExists = await this.findRoleById(role_id);
        if (!roleExists) {
            throw new common_1.NotFoundException(`Role with ID ${role_id} not found.`);
        }
        return this.prisma.roles.update({
            where: { role_id },
            data: updateRoleDto,
        });
    }
    async deleteRole(role_id) {
        console.log(`Deleting role with ID: ${role_id} and its related users`);
        const roleExists = await this.findRoleById(role_id);
        if (!roleExists) {
            throw new common_1.NotFoundException(`Role with ID ${role_id} not found.`);
        }
        await this.prisma.user_role.deleteMany({
            where: { role_id },
        });
        return this.prisma.roles.delete({
            where: { role_id },
        });
    }
};
exports.RoleService = RoleService;
exports.RoleService = RoleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RoleService);
//# sourceMappingURL=role.service.js.map