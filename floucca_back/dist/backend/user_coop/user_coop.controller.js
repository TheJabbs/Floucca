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
exports.UserCoopController = void 0;
const common_1 = require("@nestjs/common");
const user_coop_service_1 = require("./user_coop.service");
const create_user_coop_dto_1 = require("./dto/create-user_coop.dto");
const id_dto_1 = require("../../shared/dto/id.dto");
let UserCoopController = class UserCoopController {
    constructor(userCoopService) {
        this.userCoopService = userCoopService;
    }
    async createUserCoop(createUserCoopDto) {
        return this.userCoopService.createUserCoop(createUserCoopDto);
    }
    async findAllUserCoops() {
        return this.userCoopService.findAllUserCoops();
    }
    async findUserCoopById(user_coop_id) {
        const id = parseInt(user_coop_id, 10);
        return this.userCoopService.findUserCoopById(id);
    }
    async updateUserCoop(params, updateUserCoopDto) {
        return this.userCoopService.updateUserCoop(params.id, updateUserCoopDto);
    }
    async deleteUserCoop(user_coop_id) {
        const id = parseInt(user_coop_id, 10);
        console.log("Deleting user coop with ID:", id);
        return this.userCoopService.deleteUserCoop(id);
    }
};
exports.UserCoopController = UserCoopController;
__decorate([
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_coop_dto_1.CreateUserCoopDto]),
    __metadata("design:returntype", Promise)
], UserCoopController.prototype, "createUserCoop", null);
__decorate([
    (0, common_1.Get)("all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserCoopController.prototype, "findAllUserCoops", null);
__decorate([
    (0, common_1.Get)(":user_coop_id"),
    __param(0, (0, common_1.Param)("user_coop_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserCoopController.prototype, "findUserCoopById", null);
__decorate([
    (0, common_1.Put)("update/:id"),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO, create_user_coop_dto_1.CreateUserCoopDto]),
    __metadata("design:returntype", Promise)
], UserCoopController.prototype, "updateUserCoop", null);
__decorate([
    (0, common_1.Delete)("delete/:user_coop_id"),
    __param(0, (0, common_1.Param)("user_coop_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserCoopController.prototype, "deleteUserCoop", null);
exports.UserCoopController = UserCoopController = __decorate([
    (0, common_1.Controller)("user-coops"),
    __metadata("design:paramtypes", [user_coop_service_1.UserCoopService])
], UserCoopController);
//# sourceMappingURL=user_coop.controller.js.map