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
exports.GearUsageController = void 0;
const index_1 = require("./dto/index");
const common_1 = require("@nestjs/common");
const gear_usage_service_1 = require("./gear_usage.service");
const id_dto_1 = require("../../shared/dto/id.dto");
let GearUsageController = class GearUsageController {
    constructor(gearUsageService) {
        this.gearUsageService = gearUsageService;
    }
    getAllGearUsage() {
        return this.gearUsageService.getAllGearUsage();
    }
    getGearUsageByGearUsageId(gearUsageId) {
        return this.gearUsageService.getGearUsageById(gearUsageId.id);
    }
    createGearUsage(newGearUsage) {
        return this.gearUsageService.createGearUsage(newGearUsage);
    }
    updateGearUsage(gearUsageId, updatedGearUsage) {
        return this.gearUsageService.updateGearUsage(gearUsageId.id, updatedGearUsage);
    }
    deleteGearUsage(gearUsageId) {
        return this.gearUsageService.deleteGearUsage(gearUsageId.id);
    }
};
exports.GearUsageController = GearUsageController;
__decorate([
    (0, common_1.Get)('/all/gear_usage'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GearUsageController.prototype, "getAllGearUsage", null);
__decorate([
    (0, common_1.Get)('/gear_usage/:gear_usage_id'),
    __param(0, (0, common_1.Param)('gear_usage_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], GearUsageController.prototype, "getGearUsageByGearUsageId", null);
__decorate([
    (0, common_1.Post)('/create/gear_usage'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_1.CreateGearUsageDto]),
    __metadata("design:returntype", void 0)
], GearUsageController.prototype, "createGearUsage", null);
__decorate([
    (0, common_1.Put)('/update/gear_usage/:gear_usage_id'),
    __param(0, (0, common_1.Param)('gear_usage_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO, index_1.UpdateGearUsageDto]),
    __metadata("design:returntype", void 0)
], GearUsageController.prototype, "updateGearUsage", null);
__decorate([
    (0, common_1.Delete)('/delete/gear_usage/:gear_usage_id'),
    __param(0, (0, common_1.Param)('gear_usage_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], GearUsageController.prototype, "deleteGearUsage", null);
exports.GearUsageController = GearUsageController = __decorate([
    (0, common_1.Controller)('api/dev/gear_usage'),
    __metadata("design:paramtypes", [gear_usage_service_1.GearUsageService])
], GearUsageController);
//# sourceMappingURL=gear_usage.controller.js.map