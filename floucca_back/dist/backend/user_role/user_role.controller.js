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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleController = void 0;
const common_1 = require("@nestjs/common");
const user_role_service_1 = require("./user_role.service");
const create_user_role_dto_1 = require("./dto/create-user_role.dto");
const id_dto_1 = require("../../shared/dto/id.dto");
let UserRoleController = class UserRoleController {
    constructor(userRoleService) {
        this.userRoleService = userRoleService;
    }
    async createUserRole(createUserRoleDto) {
        return this.userRoleService.createUserRole(createUserRoleDto);
    }
    async findAllUserRoles() {
        return this.userRoleService.findAllUserRoles();
    }
    async findUserRoleById(params) {
        return this.userRoleService.findUserRoleById(params.id);
    }
    async updateUserRole(params, updateUserRoleDto) {
        return this.userRoleService.updateUserRole(params.id, updateUserRoleDto);
    }
    async deleteUserRole(user_role_id) {
        const id = parseInt(user_role_id, 10);
        console.log("Deleting user role with ID:", id);
        return this.userRoleService.deleteUserRole(id);
    }
};
exports.UserRoleController = UserRoleController;
__decorate([
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_role_dto_1.CreateUserRoleDto]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "createUserRole", null);
__decorate([
    (0, common_1.Get)("all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "findAllUserRoles", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "findUserRoleById", null);
__decorate([
    (0, common_1.Put)("update/:id"),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO, create_user_role_dto_1.CreateUserRoleDto]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "updateUserRole", null);
__decorate([
    (0, common_1.Delete)("delete/:user_role_id"),
    __param(0, (0, common_1.Param)("user_role_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserRoleController.prototype, "deleteUserRole", null);
exports.UserRoleController = UserRoleController = __decorate([
    (0, common_1.Controller)("user-roles"),
    __metadata("design:paramtypes", [user_role_service_1.UserRoleService])
], UserRoleController);
//# sourceMappingURL=user_role.controller.js.map