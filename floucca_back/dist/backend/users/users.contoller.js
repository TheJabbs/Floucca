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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_users_dto_1 = require("./dto/create-users.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async createUser(createUserDto) {
        return this.userService.createUser(createUserDto);
    }
    async findAllUsers() {
        return this.userService.findAllUsers();
    }
    async findUserById(user_id, req) {
        const id = parseInt(user_id, 10);
        console.log(`Authenticated user: ${req.user.user_id}`);
        return this.userService.findUserById(id);
    }
    async updateUser(user_id, updateUserDto) {
        const id = parseInt(user_id, 10);
        return this.userService.updateUser(id, updateUserDto);
    }
    async updateLastLogin(user_id) {
        const id = parseInt(user_id, 10);
        console.log("Updating last login for user ID:", id);
        await this.userService.updateLastLogin(id);
    }
    async deleteUser(user_id) {
        const id = parseInt(user_id, 10);
        console.log("Deleting user with ID:", id);
        return this.userService.deleteUser(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_users_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)("all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAllUsers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(":user_id"),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findUserById", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)("update/:user_id"),
    __param(0, (0, common_1.Param)("user_id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_users_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)("update-last-login/:user_id"),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateLastLogin", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)("delete/:user_id"),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [users_service_1.UserService])
], UserController);
//# sourceMappingURL=users.contoller.js.map